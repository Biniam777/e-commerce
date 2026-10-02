const orderService = require('../services/orderService');

const create = async (req, res, next) => {
  try {
    const order = await orderService.create(req.user.id, req.validatedBody);
    res.status(201).json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await orderService.list(req.user.id, req.validatedQuery);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const order = await orderService.findById(req.user.id, req.params.id);
    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, list, findById };