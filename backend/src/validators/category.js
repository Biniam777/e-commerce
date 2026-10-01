const maximumNameLength = 100;
const forbiddenUpdateFields = ['id', 'slug', 'createdAt', 'updatedAt'];

const validationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getBody = (req) =>
  req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};

const validateName = (body) => {
  if (typeof body.name !== 'string' || !body.name.trim()) {
    throw validationError('Name is required');
  }

  const name = body.name.trim();

  if (name.length > maximumNameLength) {
    throw validationError(`Name must be ${maximumNameLength} characters or fewer`);
  }

  return name;
};

const validateCreate = (req, res, next) => {
  try {
    req.validatedBody = { name: validateName(getBody(req)) };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateUpdate = (req, res, next) => {
  try {
    const body = getBody(req);
    const suppliedForbiddenField = forbiddenUpdateFields.find((field) =>
      Object.prototype.hasOwnProperty.call(body, field)
    );

    if (suppliedForbiddenField) {
      throw validationError(`${suppliedForbiddenField} cannot be updated`);
    }

    req.validatedBody = { name: validateName(body) };
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { validateCreate, validateUpdate };