const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.validatedBody);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.validatedBody);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const me = (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
};

module.exports = { register, login, me };