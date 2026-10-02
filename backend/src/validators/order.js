const maximumAddressLength = 500;
const maximumNameLength = 200;
const maximumPageLimit = 100;
const maximumPhoneLength = 50;

const validationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getBody = (req) =>
  req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};

const validateText = (value, field, maximumLength) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw validationError(`${field} is required`);
  }

  const text = value.trim();

  if (text.length > maximumLength) {
    throw validationError(`${field} must be ${maximumLength} characters or fewer`);
  }

  return text;
};

const validateCheckout = (req, res, next) => {
  try {
    const body = getBody(req);
    const allowedFields = ['shippingName', 'shippingPhone', 'shippingAddress'];
    const unknownField = Object.keys(body).find((field) => !allowedFields.includes(field));

    if (unknownField) {
      throw validationError(`${unknownField} is not supported`);
    }

    req.validatedBody = {
      shippingName: validateText(body.shippingName, 'Shipping name', maximumNameLength),
      shippingPhone: validateText(body.shippingPhone, 'Shipping phone', maximumPhoneLength),
      shippingAddress: validateText(body.shippingAddress, 'Shipping address', maximumAddressLength)
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

const validateListQuery = (req, res, next) => {
  try {
    const allowedFields = ['page', 'limit'];
    const unknownField = Object.keys(req.query).find((field) => !allowedFields.includes(field));

    if (unknownField) {
      throw validationError(`${unknownField} is not supported`);
    }

    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);

    if (!Number.isInteger(page) || page < 1) {
      throw validationError('Page must be a positive integer');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > maximumPageLimit) {
      throw validationError(`Limit must be an integer between 1 and ${maximumPageLimit}`);
    }

    req.validatedQuery = { page, limit };
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { validateCheckout, validateListQuery };