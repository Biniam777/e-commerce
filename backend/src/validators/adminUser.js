const maximumPageLimit = 100;
const allowedRoles = ['USER', 'ADMIN'];

const validationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateListQuery = (req, res, next) => {
  try {
    const allowedFields = ['page', 'limit', 'search'];
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

    req.validatedQuery = {
      page,
      limit,
      ...(req.query.search === undefined ? {} : { search: String(req.query.search).trim() })
    };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateRoleUpdate = (req, res, next) => {
  try {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
      ? req.body
      : {};
    const fields = Object.keys(body);
    const unknownField = fields.find((field) => field !== 'role');

    if (unknownField) {
      throw validationError(`${unknownField} is not supported`);
    }

    if (fields.length !== 1 || !allowedRoles.includes(body.role)) {
      throw validationError('Role must be USER or ADMIN');
    }

    req.validatedBody = { role: body.role };
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { validateListQuery, validateRoleUpdate };