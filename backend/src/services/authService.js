const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config/env');
const prisma = require('../config/prisma');
const { toSafeUser } = require('../utils/user');

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true
};

const createToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

const createConflictError = () => {
  const error = new Error('Email is already registered');
  error.statusCode = 409;
  return error;
};

const createAuthenticationError = () => {
  const error = new Error('Invalid email or password');
  error.statusCode = 401;
  return error;
};

const register = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });

  if (existingUser) {
    throw createConflictError();
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: safeUserSelect
    });

    return {
      user: toSafeUser(user),
      token: createToken(user)
    };
  } catch (error) {
    if (error.code === 'P2002') {
      throw createConflictError();
    }

    throw error;
  }
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      ...safeUserSelect,
      passwordHash: true
    }
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw createAuthenticationError();
  }

  return {
    user: toSafeUser(user),
    token: createToken(user)
  };
};

const findSafeUserById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: safeUserSelect
  });

module.exports = { register, login, findSafeUserById };