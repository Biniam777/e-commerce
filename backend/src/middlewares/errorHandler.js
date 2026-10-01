const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode < 400 || statusCode >= 500;

  res.status(isServerError ? 500 : statusCode).json({
    success: false,
    message: isServerError ? 'Internal server error' : err.message
  });
};

module.exports = errorHandler;