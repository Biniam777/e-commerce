const allowedActions = ['success', 'fail'];

const validationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validatePayment = (req, res, next) => {
  try {
    const body =
      req.body && typeof req.body === 'object' && !Array.isArray(req.body)
        ? req.body
        : {};

    const fields = Object.keys(body);
    const unknownField = fields.find((field) => field !== 'action');

    if (unknownField) {
      throw validationError(`${unknownField} is not supported`);
    }

    if (fields.length !== 1 || !allowedActions.includes(body.action)) {
      throw validationError('Payment action must be success or fail');
    }

    req.validatedBody = { action: body.action };

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { validatePayment };

