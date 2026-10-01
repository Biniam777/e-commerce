const categoryService = require('../services/categoryService');

const create = async (req, res, next) => {
  try {
    const category = await categoryService.create(req.validatedBody);
    res.status(201).json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const categories = await categoryService.list();
    res.json({ success: true, data: { categories } });
  } catch (error) {
    next(error);
  }
};

const findBySlug = async (req, res, next) => {
  try {
    const category = await categoryService.findBySlug(req.params.slug);
    res.json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await categoryService.update(req.params.id, req.validatedBody);
    res.json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await categoryService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { create, list, findBySlug, update, remove };