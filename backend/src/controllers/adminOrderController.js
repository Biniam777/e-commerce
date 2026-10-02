const adminOrderService = require('../services/adminOrderService');

const list = async (req, res, next) => {
  try {
    const data = await adminOrderService.list(req.validatedQuery);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const order = await adminOrderService.findById(req.params.id);
    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await adminOrderService.updateStatus(req.params.id, req.validatedBody.status);
    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

module.exports = { list, findById, updateStatus };