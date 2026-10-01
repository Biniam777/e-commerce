const productService = require('../services/productService');

const create = async (req, res, next) => {
  try {
    const product = await productService.create(req.validatedBody);
    res.status(201).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await productService.list(req.validatedQuery);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const findBySlug = async (req, res, next) => {
  try {
    const product = await productService.findBySlug(req.params.slug);
    res.json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.validatedBody);
    res.json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await productService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { create, list, findBySlug, update, remove };