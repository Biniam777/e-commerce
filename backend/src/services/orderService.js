const { Prisma } = require('@prisma/client');

const prisma = require('../config/prisma');

const shippingCost = new Prisma.Decimal('0.00');

const orderItemSelect = {
  id: true,
  productId: true,
  productName: true,
  price: true,
  quantity: true,
  subtotal: true,
  product: {
    select: {
      id: true,
      slug: true
    }
  }
};

const orderSelect = {
  id: true,
  userId: true,
  status: true,
  paymentStatus: true,
  subtotal: true,
  shippingCost: true,
  total: true,
  shippingName: true,
  shippingPhone: true,
  shippingAddress: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: orderItemSelect,
    orderBy: { id: 'asc' }
  }
};

const badRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const notFound = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

const stockConflict = () => {
  const error = new Error('Insufficient stock for one or more products');
  error.statusCode = 409;
  return error;
};

const serializeOrder = (order) => ({
  ...order,
  subtotal: order.subtotal.toFixed(2),
  shippingCost: order.shippingCost.toFixed(2),
  total: order.total.toFixed(2),
  items: order.items.map((item) => ({
    ...item,
    price: item.price.toFixed(2),
    subtotal: item.subtotal.toFixed(2)
  }))
});

const serializeOrders = (orders) => orders.map(serializeOrder);

const create = async (userId, shipping) =>
  prisma.$transaction(
    async (transaction) => {
      const cart = await transaction.cart.findUnique({
        where: { userId },
        select: {
          id: true,
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true
            },
            orderBy: [{ createdAt: 'asc' }, { id: 'asc' }]
          }
        }
      });

      if (!cart || cart.items.length === 0) {
        throw badRequest('Cart is empty');
      }

      const orderItems = [];
      let subtotal = new Prisma.Decimal(0);

      for (const cartItem of cart.items) {
        if (!Number.isInteger(cartItem.quantity) || cartItem.quantity < 1) {
          throw badRequest('Cart contains an invalid quantity');
        }

        const product = await transaction.product.findUnique({
          where: { id: cartItem.productId },
          select: {
            id: true,
            name: true,
            price: true,
            stock: true
          }
        });

        if (!product) {
          throw notFound('Product referenced by cart no longer exists');
        }

        if (cartItem.quantity > product.stock) {
          throw stockConflict();
        }

        const itemSubtotal = product.price.mul(cartItem.quantity);
        subtotal = subtotal.plus(itemSubtotal);

        orderItems.push({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: cartItem.quantity,
          subtotal: itemSubtotal
        });
      }

      const total = subtotal.plus(shippingCost);

      const order = await transaction.order.create({
        data: {
          userId,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          subtotal,
          shippingCost,
          total,
          ...shipping
        },
        select: { id: true }
      });

      await transaction.orderItem.createMany({
        data: orderItems.map((item) => ({
          ...item,
          orderId: order.id
        }))
      });

      for (const item of orderItems) {
        const updatedProducts = await transaction.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity }
          },
          data: {
            stock: { decrement: item.quantity }
          }
        });

        if (updatedProducts.count !== 1) {
          throw stockConflict();
        }
      }

      await transaction.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      const createdOrder = await transaction.order.findUnique({
        where: { id: order.id },
        select: orderSelect
      });

      if (!createdOrder) {
        throw new Error('Created order could not be retrieved');
      }

      return serializeOrder(createdOrder);
    },
    {
      maxWait: 10000,
      timeout: 15000
    }
  );

const list = async (userId, { page, limit }) => {
  const where = { userId };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      select: orderSelect
    }),
    prisma.order.count({ where })
  ]);

  return {
    orders: serializeOrders(orders),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const findById = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId
    },
    select: orderSelect
  });

  if (!order) {
    throw notFound('Order not found');
  }

  return serializeOrder(order);
};

const processPayment = async (userId, orderId, action) =>
  prisma.$transaction(
    async (transaction) => {
      const order = await transaction.order.findFirst({
        where: {
          id: orderId,
          userId
        },
        select: {
          id: true,
          paymentStatus: true,
          status: true
        }
      });

      if (!order) {
        throw notFound('Order not found');
      }

      if (order.status === 'CANCELLED') {
        throw badRequest('Cancelled orders cannot be paid');
      }

      if (order.paymentStatus === 'PAID') {
        throw badRequest('Order has already been paid');
      }

      if (
        order.paymentStatus !== 'PENDING' &&
        order.paymentStatus !== 'FAILED'
      ) {
        throw badRequest('Order cannot be paid in its current payment state');
      }

      const paymentStatus = action === 'success' ? 'PAID' : 'FAILED';

      const updatedOrder = await transaction.order.update({
        where: { id: order.id },
        data: { paymentStatus },
        select: orderSelect
      });

      return serializeOrder(updatedOrder);
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    }
  );

module.exports = { create, list, findById, processPayment };