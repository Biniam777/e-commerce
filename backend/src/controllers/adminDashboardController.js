const adminDashboardService = require('../services/adminDashboardService');

const get = async (req, res, next) => {
  try {
    const data = await adminDashboardService.get();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { get };