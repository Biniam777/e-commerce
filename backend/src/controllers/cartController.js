const cartService = require('../services/cartService');

const get = async (req, res, next) => {
  try {
    const data = await cartService.get(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const cartItem = await cartService.addItem(req.user.id, req.validatedBody);
    res.status(201).json({ success: true, data: { cartItem } });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const cartItem = await cartService.updateItem(
      req.user.id,
      req.params.id,
      req.validatedBody
    );
    res.json({ success: true, data: { cartItem } });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    await cartService.removeItem(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { get, addItem, updateItem, removeItem };