const orderService = require('../services/orderService');

const process = async (req, res, next) => {
  try {
    const order = await orderService.processPayment(
      req.user.id,
      req.params.id,
      req.validatedBody.action
    );

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

module.exports = { process };
