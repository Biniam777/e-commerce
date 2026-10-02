const adminUserService = require('../services/adminUserService');

const list = async (req, res, next) => {
  try {
    const data = await adminUserService.list(req.validatedQuery);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const user = await adminUserService.findById(req.params.id);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const user = await adminUserService.updateRole(
      req.user.id,
      req.params.id,
      req.validatedBody.role
    );
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

module.exports = { list, findById, updateRole };