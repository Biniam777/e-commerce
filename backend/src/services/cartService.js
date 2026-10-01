const { Prisma } = require('@prisma/client');

const prisma = require('../config/prisma');

const imageSelect = {
  id: true,
  url: true,
  altText: true,
  sortOrder: true,
  createdAt: true
};

const cartItemSelect = {
  id: true,
  cartId: true,
  productId: true,
  quantity: true,
  createdAt: true,
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      stock: true,
      images: {
        select: imageSelect,
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        take: 1
      }
    }
  }
};

const cartSelect = {
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: cartItemSelect,
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }]
  }
};

const notFound = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

const stockConflict = () => {
  const error = new Error('Requested quantity exceeds available stock');
  error.statusCode = 409;
  return error;
};

const serializeProduct = (product) => ({
  ...product,
  price: product.price.toString()
});

const serializeCartItem = (item) => ({
  ...item,
  product: serializeProduct(item.product)
});

const serializeCart = (cart) => ({
  ...cart,
  items: cart.items.map(serializeCartItem)
});

const calculateSubtotal = (items) =>
  items
    .reduce(
      (subtotal, item) => subtotal.plus(item.product.price.mul(item.quantity)),
      new Prisma.Decimal(0)
    )
    .toFixed(2);

const getOrCreateCart = (userId, client = prisma) =>
  client.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: cartSelect
  });

const get = async (userId) => {
  const cart = await getOrCreateCart(userId);

  return {
    cart: serializeCart(cart),
    subtotal: calculateSubtotal(cart.items)
  };
};

const addItem = async (userId, { productId, quantity }) =>
  prisma.$transaction(async (transaction) => {
    const product = await transaction.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true }
    });

    if (!product) {
      throw notFound('Product not found');
    }

    const cart = await transaction.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      select: { id: true }
    });
    const existingItem = await transaction.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
      select: { id: true, quantity: true }
    });
    const resultingQuantity = (existingItem?.quantity || 0) + quantity;

    if (resultingQuantity > product.stock) {
      throw stockConflict();
    }

    const item = existingItem
      ? await transaction.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: resultingQuantity },
          select: cartItemSelect
        })
      : await transaction.cartItem.create({
          data: { cartId: cart.id, productId, quantity },
          select: cartItemSelect
        });

    return serializeCartItem(item);
  });

const findOwnedCartItem = async (userId, itemId, client = prisma) => {
  const cart = await client.cart.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!cart) {
    throw notFound('Cart item not found');
  }

  const item = await client.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
    select: cartItemSelect
  });

  if (!item) {
    throw notFound('Cart item not found');
  }

  return { cart, item };
};

const updateItem = async (userId, itemId, { quantity }) =>
  prisma.$transaction(async (transaction) => {
    const { cart, item } = await findOwnedCartItem(userId, itemId, transaction);
    const product = await transaction.product.findUnique({
      where: { id: item.productId },
      select: { id: true, stock: true }
    });

    if (!product) {
      throw notFound('Product not found');
    }

    if (quantity > product.stock) {
      throw stockConflict();
    }

    const updatedItem = await transaction.cartItem.update({
      where: { id: item.id },
      data: { quantity },
      select: cartItemSelect
    });

    return serializeCartItem(updatedItem);
  });

const removeItem = async (userId, itemId) =>
  prisma.$transaction(async (transaction) => {
    const { item } = await findOwnedCartItem(userId, itemId, transaction);
    await transaction.cartItem.delete({ where: { id: item.id } });
  });

module.exports = { get, addItem, updateItem, removeItem };