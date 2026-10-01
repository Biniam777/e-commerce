const express = require('express');

const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
const authRouter = require('./routes/auth');
const healthRouter = require('./routes/health');

const app = express();

app.use(express.json());
app.use('/api', healthRouter);
app.use('/api/auth', authRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;