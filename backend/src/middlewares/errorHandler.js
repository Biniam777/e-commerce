const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode < 400 || statusCode >= 500;

  if (isServerError) {
    console.error('Unhandled server error:', {
      method: req.method,
      path: req.originalUrl,
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
  }

  res.status(isServerError ? 500 : statusCode).json({
    success: false,
    message: isServerError ? 'Internal server error' : err.message
  });
};

module.exports = errorHandler;