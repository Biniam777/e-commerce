const validationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getBody = (req) =>
  req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};

const validateProductId = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw validationError('Product ID is required');
  }

  return value.trim();
};

const validateQuantity = (value) => {
  if (!Number.isInteger(value) || value < 1) {
    throw validationError('Quantity must be a positive integer');
  }

  return value;
};

const validateBody = (req, next, requiredFields) => {
  try {
    const body = getBody(req);
    const allowedFields = ['productId', 'quantity'];
    const unknownField = Object.keys(body).find((field) => !allowedFields.includes(field));

    if (unknownField) {
      throw validationError(`${unknownField} is not supported`);
    }

    for (const field of requiredFields) {
      if (!Object.prototype.hasOwnProperty.call(body, field)) {
        throw validationError(`${field} is required`);
      }
    }

    req.validatedBody = {
      ...(requiredFields.includes('productId') ? { productId: validateProductId(body.productId) } : {}),
      quantity: validateQuantity(body.quantity)
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

const validateAdd = (req, res, next) => validateBody(req, next, ['productId', 'quantity']);
const validateUpdate = (req, res, next) => validateBody(req, next, ['quantity']);

module.exports = { validateAdd, validateUpdate };