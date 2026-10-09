const jwt = require('jsonwebtoken');

const config = require('../config/env');
const authService = require('../services/authService');

const unauthorized = (res) =>
  res.status(401).json({
    success: false,
    message: 'Authentication required'
  });

const authenticate = async (req, res, next) => {
  const authorization = req.get('authorization');
  const match = authorization && authorization.match(/^Bearer\s+([^\s]+)$/i);

  if (!match) {
    return unauthorized(res);
  }

  let payload;

  try {
    payload = jwt.verify(match[1], config.jwtSecret, {
      algorithms: [config.jwtAlgorithm]
    });
  } catch (error) {
    return unauthorized(res);
  }

  if (!payload || typeof payload !== 'object' || typeof payload.sub !== 'string') {
    return unauthorized(res);
  }

  try {
    const user = await authService.findSafeUserById(payload.sub);

    if (!user) {
      return unauthorized(res);
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authenticate;