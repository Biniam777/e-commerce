const prisma = require('../config/prisma');
const { slugify } = require('../utils/slug');
const { sortOptions } = require('../validators/product');

const categorySelect = {
  id: true,
  name: true,
  slug: true
};

const imageSelect = {
  id: true,
  url: true,
  altText: true,
  sortOrder: true,
  createdAt: true
};

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  stock: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
  category: { select: categorySelect },
  images: {
    select: imageSelect,
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }]
  }
};

const notFound = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

const conflict = (message) => {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
};

const badRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const serializeProduct = (product) => ({
  ...product,
  price: product.price.toString()
});

const serializeProducts = (products) => products.map(serializeProduct);

const ensureCategory = async (client, categoryId) => {
  const category = await client.category.findUnique({
    where: { id: categoryId },
    select: { id: true }
  });

  if (!category) {
    throw notFound('Category not found');
  }
};

const toImageData = (images) =>
  images.map(({ url, altText, sortOrder }) => ({
    url,
    ...(altText === undefined ? {} : { altText }),
    sortOrder
  }));

const create = async ({ name, description, price, stock, categoryId, images = [] }) => {
  const slug = slugify(name);

  if (!slug) {
    throw badRequest('Name must contain URL-friendly characters');
  }

  try {
    return await prisma.$transaction(async (transaction) => {
      await ensureCategory(transaction, categoryId);

      return transaction.product.create({
        data: {
          name,
          slug,
          description,
          price,
          stock,
          categoryId,
          images: { create: toImageData(images) }
        },
        select: productSelect
      });
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw conflict('Product already exists');
    }

    throw error;
  }
};

const list = async ({ search, category, minPrice, maxPrice, sort, page, limit }) => {
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } }
    ];
  }

  if (category) {
    where.category = { is: { slug: category } };
  }

  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: minPrice } : {}),
      ...(maxPrice ? { lte: maxPrice } : {})
    };
  }

  const orderBy = sortOptions[sort] || sortOptions.newest;
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [orderBy, { id: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
      select: productSelect
    }),
    prisma.product.count({ where })
  ]);

  return {
    products: serializeProducts(products),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const findBySlug = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: productSelect
  });

  if (!product) {
    throw notFound('Product not found');
  }

  return serializeProduct(product);
};

const update = async (id, changes) => {
  try {
    return await prisma.$transaction(async (transaction) => {
      const existingProduct = await transaction.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          categoryId: true
        }
      });

      if (!existingProduct) {
        throw notFound('Product not found');
      }

      if (changes.categoryId && changes.categoryId !== existingProduct.categoryId) {
        await ensureCategory(transaction, changes.categoryId);
      }

      const data = { ...changes };

      if (changes.name !== undefined) {
        const slug = slugify(changes.name);

        if (!slug) {
          throw badRequest('Name must contain URL-friendly characters');
        }

        data.slug = slug;
      }

      if (changes.images !== undefined) {
        data.images = {
          deleteMany: {},
          create: toImageData(changes.images)
        };
      }

      return transaction.product.update({
        where: { id },
        data,
        select: productSelect
      });
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw conflict('Product already exists');
    }

    throw error;
  }
};

const remove = async (id) => {
  try {
    await prisma.$transaction(async (transaction) => {
      const product = await transaction.product.findUnique({
        where: { id },
        select: {
          id: true,
          _count: {
            select: { orderItems: true }
          }
        }
      });

      if (!product) {
        throw notFound('Product not found');
      }

      if (product._count.orderItems > 0) {
        throw conflict('Cannot delete product with existing order items');
      }

      await transaction.productImage.deleteMany({ where: { productId: id } });
      await transaction.product.delete({ where: { id } });
    });
  } catch (error) {
    if (error.code === 'P2003') {
      throw conflict('Cannot delete product with existing references');
    }

    throw error;
  }
};

module.exports = { create, list, findBySlug, update, remove };