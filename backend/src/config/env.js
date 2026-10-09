const dotenv = require('dotenv');

dotenv.config();

const requiredEnvironmentVariables = [
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN'
];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (name) => !process.env[name]
);

if (missingEnvironmentVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvironmentVariables.join(', ')}`
  );
}

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

const nodeEnv = process.env.NODE_ENV || 'development';

const allowedNodeEnvironments = new Set([
  'development',
  'test',
  'production'
]);

if (!allowedNodeEnvironments.has(nodeEnv)) {
  throw new Error(
    'NODE_ENV must be one of: development, test, production'
  );
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

module.exports = Object.freeze({
  port,
  nodeEnv,
  isProduction: nodeEnv === 'production',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtAlgorithm: 'HS256'
});