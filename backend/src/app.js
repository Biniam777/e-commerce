const express = require('express');

const adminDashboardRouter = require('./routes/adminDashboard');
const adminOrdersRouter = require('./routes/adminOrders');
const adminUsersRouter = require('./routes/adminUsers');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const categoryRouter = require('./routes/categories');
const healthRouter = require('./routes/health');
const orderRouter = require('./routes/orders');
const productRouter = require('./routes/products');

const app = express();

app.use(express.json());
app.use('/api', healthRouter);
app.use('/api/admin/orders', adminOrdersRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/admin', adminDashboardRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;