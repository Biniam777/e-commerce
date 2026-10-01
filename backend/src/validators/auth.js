const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minimumPasswordLength = 8;

const validationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateRegister = (req, res, next) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!name) {
    return next(validationError('Name is required'));
  }

  if (!email) {
    return next(validationError('Email is required'));
  }

  if (!emailPattern.test(email)) {
    return next(validationError('Email must be valid'));
  }

  if (!password) {
    return next(validationError('Password is required'));
  }

  if (password.length < minimumPasswordLength) {
    return next(
      validationError(`Password must be at least ${minimumPasswordLength} characters`)
    );
  }

  req.validatedBody = { name, email, password };
  return next();
};

const validateLogin = (req, res, next) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !emailPattern.test(email)) {
    return next(validationError('Email must be valid'));
  }

  if (!password) {
    return next(validationError('Password is required'));
  }

  req.validatedBody = { email, password };
  return next();
};

module.exports = { validateRegister, validateLogin };