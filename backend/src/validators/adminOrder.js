const allowedOrderStatuses = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];
const allowedPaymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
const maximumPageLimit = 100;

const validationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateListQuery = (req, res, next) => {
  try {
    const allowedFields = ['page', 'limit', 'status', 'paymentStatus', 'search'];
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

    if (req.query.status !== undefined && !allowedOrderStatuses.includes(req.query.status)) {
      throw validationError('Status is not supported');
    }

    if (
      req.query.paymentStatus !== undefined &&
      !allowedPaymentStatuses.includes(req.query.paymentStatus)
    ) {
      throw validationError('Payment status is not supported');
    }

    req.validatedQuery = {
      page,
      limit,
      ...(req.query.status === undefined ? {} : { status: req.query.status }),
      ...(req.query.paymentStatus === undefined ? {} : { paymentStatus: req.query.paymentStatus }),
      ...(req.query.search === undefined ? {} : { search: String(req.query.search).trim() })
    };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateStatusUpdate = (req, res, next) => {
  try {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
      ? req.body
      : {};
    const fields = Object.keys(body);
    const unknownField = fields.find((field) => field !== 'status');

    if (unknownField) {
      throw validationError(`${unknownField} is not supported`);
    }

    if (fields.length !== 1 || !allowedOrderStatuses.includes(body.status)) {
      throw validationError('Status is not supported');
    }

    req.validatedBody = { status: body.status };
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { validateListQuery, validateStatusUpdate };