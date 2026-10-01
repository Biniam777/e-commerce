const maximumDescriptionLength = 5000;
const maximumNameLength = 200;
const maximumImages = 50;
const maximumPageLimit = 100;

const sortOptions = {
  name_asc: { name: 'asc' },
  name_desc: { name: 'desc' },
  price_asc: { price: 'asc' },
  price_desc: { price: 'desc' },
  newest: { createdAt: 'desc' },
  oldest: { createdAt: 'asc' }
};

const validationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getBody = (req) =>
  req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};

const validateName = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw validationError('Name is required');
  }

  const name = value.trim();

  if (name.length > maximumNameLength) {
    throw validationError(`Name must be ${maximumNameLength} characters or fewer`);
  }

  return name;
};

const validateDescription = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw validationError('Description is required');
  }

  const description = value.trim();

  if (description.length > maximumDescriptionLength) {
    throw validationError(
      `Description must be ${maximumDescriptionLength} characters or fewer`
    );
  }

  return description;
};

const validatePrice = (value) => {
  const price = typeof value === 'number' ? String(value) : value;

  if (
    typeof price !== 'string' ||
    !/^\d+(\.\d{1,2})?$/.test(price.trim()) ||
    Number(price) < 0
  ) {
    throw validationError('Price must be a non-negative monetary value');
  }

  return price.trim();
};

const validateStock = (value) => {
  if (!Number.isInteger(value) || value < 0) {
    throw validationError('Stock must be a non-negative integer');
  }

  return value;
};

const validateCategoryId = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw validationError('Category ID is required');
  }

  return value.trim();
};

const validateImageUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw validationError('Image URL is required');
  }

  let url;

  try {
    url = new URL(value.trim());
  } catch (error) {
    throw validationError('Image URL must be valid');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw validationError('Image URL must use HTTP or HTTPS');
  }

  return url.toString();
};

const validateImages = (value) => {
  if (!Array.isArray(value) || value.length > maximumImages) {
    throw validationError(`Images must be an array of at most ${maximumImages} items`);
  }

  return value.map((image, index) => {
    if (!image || typeof image !== 'object' || Array.isArray(image)) {
      throw validationError('Each image must be an object');
    }

    const sortOrder = image.sortOrder === undefined ? index : image.sortOrder;

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      throw validationError('Image sortOrder must be a non-negative integer');
    }

    if (image.altText !== undefined && image.altText !== null && typeof image.altText !== 'string') {
      throw validationError('Image altText must be a string');
    }

    return {
      url: validateImageUrl(image.url),
      ...(image.altText === undefined ? {} : { altText: image.altText }),
      sortOrder
    };
  });
};

const validateCreate = (req, res, next) => {
  try {
    const body = getBody(req);

    req.validatedBody = {
      name: validateName(body.name),
      description: validateDescription(body.description),
      price: validatePrice(body.price),
      stock: validateStock(body.stock),
      categoryId: validateCategoryId(body.categoryId),
      ...(body.images === undefined ? {} : { images: validateImages(body.images) })
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

const validateUpdate = (req, res, next) => {
  try {
    const body = getBody(req);
    const allowedFields = ['name', 'description', 'price', 'stock', 'categoryId', 'images'];
    const suppliedFields = Object.keys(body);

    if (suppliedFields.length === 0) {
      throw validationError('At least one product field is required');
    }

    const unknownField = suppliedFields.find((field) => !allowedFields.includes(field));

    if (unknownField) {
      throw validationError(`${unknownField} cannot be updated`);
    }

    const validatedBody = {};

    if (Object.prototype.hasOwnProperty.call(body, 'name')) {
      validatedBody.name = validateName(body.name);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'description')) {
      validatedBody.description = validateDescription(body.description);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'price')) {
      validatedBody.price = validatePrice(body.price);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'stock')) {
      validatedBody.stock = validateStock(body.stock);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'categoryId')) {
      validatedBody.categoryId = validateCategoryId(body.categoryId);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'images')) {
      validatedBody.images = validateImages(body.images);
    }

    req.validatedBody = validatedBody;
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateListQuery = (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page, limit } = req.query;
    const parsedPage = page === undefined ? 1 : Number(page);
    const parsedLimit = limit === undefined ? 20 : Number(limit);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      throw validationError('Page must be a positive integer');
    }

    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > maximumPageLimit) {
      throw validationError(`Limit must be an integer between 1 and ${maximumPageLimit}`);
    }

    const parsedQuery = {
      page: parsedPage,
      limit: parsedLimit,
      ...(search === undefined ? {} : { search: String(search).trim() }),
      ...(category === undefined ? {} : { category: String(category).trim() }),
      ...(sort === undefined ? {} : { sort: String(sort) })
    };

    if (parsedQuery.sort && !sortOptions[parsedQuery.sort]) {
      throw validationError('Sort value is not supported');
    }

    if (minPrice !== undefined) {
      parsedQuery.minPrice = validatePrice(String(minPrice));
    }

    if (maxPrice !== undefined) {
      parsedQuery.maxPrice = validatePrice(String(maxPrice));
    }

    if (parsedQuery.minPrice && parsedQuery.maxPrice && Number(parsedQuery.minPrice) > Number(parsedQuery.maxPrice)) {
      throw validationError('Minimum price cannot exceed maximum price');
    }

    req.validatedQuery = parsedQuery;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { sortOptions, validateCreate, validateUpdate, validateListQuery };