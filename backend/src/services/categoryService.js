const prisma = require('../config/prisma');
const { slugify } = require('../utils/slug');

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  createdAt: true,
  updatedAt: true
};

const categoryNotFound = () => {
  const error = new Error('Category not found');
  error.statusCode = 404;
  return error;
};

const categoryConflict = () => {
  const error = new Error('Category already exists');
  error.statusCode = 409;
  return error;
};

const productsExist = () => {
  const error = new Error('Cannot delete category with existing products');
  error.statusCode = 409;
  return error;
};

const create = async ({ name }) => {
  const slug = slugify(name);

  if (!slug) {
    const error = new Error('Name must contain URL-friendly characters');
    error.statusCode = 400;
    throw error;
  }

  try {
    return await prisma.category.create({
      data: { name, slug },
      select: categorySelect
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw categoryConflict();
    }

    throw error;
  }
};

const list = () =>
  prisma.category.findMany({
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
    select: categorySelect
  });

const findBySlug = async (slug) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: categorySelect
  });

  if (!category) {
    throw categoryNotFound();
  }

  return category;
};

const update = async (id, { name }) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
    select: { id: true }
  });

  if (!existingCategory) {
    throw categoryNotFound();
  }

  const nextSlug = slugify(name);

  if (!nextSlug) {
    const error = new Error('Name must contain URL-friendly characters');
    error.statusCode = 400;
    throw error;
  }

  try {
    return await prisma.category.update({
      where: { id: existingCategory.id },
      data: { name, slug: nextSlug },
      select: categorySelect
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw categoryConflict();
    }

    throw error;
  }
};

const remove = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      _count: {
        select: { products: true }
      }
    }
  });

  if (!category) {
    throw categoryNotFound();
  }

  if (category._count.products > 0) {
    throw productsExist();
  }

  try {
    await prisma.category.delete({ where: { id: category.id } });
  } catch (error) {
    if (error.code === 'P2003') {
      throw productsExist();
    }

    throw error;
  }
};

module.exports = { create, list, findBySlug, update, remove };