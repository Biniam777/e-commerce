const { Prisma } = require('@prisma/client');

const prisma = require('../config/prisma');

const orderStatuses = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: []
};

const userSelect = {
  id: true,
  name: true,
  email: true
};

const listSelect = {
  id: true,
  userId: true,
  status: true,
  paymentStatus: true,
  subtotal: true,
  shippingCost: true,
  total: true,
  createdAt: true,
  updatedAt: true,
  user: { select: userSelect }
};

const itemSelect = {
  id: true,
  productId: true,
  productName: true,
  price: true,
  quantity: true,
  subtotal: true,
  product: {
    select: {
      id: true,
      slug: true
    }
  }
};

const detailSelect = {
  id: true,
  userId: true,
  status: true,
  paymentStatus: true,
  subtotal: true,
  shippingCost: true,
  total: true,
  shippingName: true,
  shippingPhone: true,
  shippingAddress: true,
  createdAt: true,
  updatedAt: true,
  user: { select: userSelect },
  items: {
    select: itemSelect,
    orderBy: { id: 'asc' }
  }
};

const notFound = () => {
  const error = new Error('Order not found');
  error.statusCode = 404;
  return error;
};

const conflict = (message) => {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
};

const serializeMoney = (order) => ({
  ...order,
  subtotal: order.subtotal.toFixed(2),
  shippingCost: order.shippingCost.toFixed(2),
  total: order.total.toFixed(2)
});

const serializeItem = (item) => ({
  ...item,
  price: item.price.toFixed(2),
  subtotal: item.subtotal.toFixed(2)
});

const serializeDetail = (order) => ({
  ...serializeMoney(order),
  items: order.items.map(serializeItem)
});

const list = async ({ page, limit, status, paymentStatus, search }) => {
  const where = {
    ...(status ? { status } : {}),
    ...(paymentStatus ? { paymentStatus } : {}),
    ...(search
      ? {
          user: {
            is: {
              OR: [
                { name: { contains: search } },
                { email: { contains: search } }
              ]
            }
          }
        }
      : {})
  };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      select: listSelect
    }),
    prisma.order.count({ where })
  ]);

  return {
    orders: orders.map(serializeMoney),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const findById = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id },
    select: detailSelect
  });

  if (!order) {
    throw notFound();
  }

  return serializeDetail(order);
};

const updateStatus = async (id, status) =>
  prisma.$transaction(async (transaction) => {
    const current = await transaction.order.findUnique({
      where: { id },
      select: {
        status: true,
        paymentStatus: true
      }
    });

    if (!current) {
      throw notFound();
    }

    if (
      current.status !== status &&
      !orderStatuses[current.status].includes(status)
    ) {
      throw conflict(
        `Invalid order status transition from ${current.status} to ${status}`
      );
    }

    if (
      current.status !== status &&
      status === 'DELIVERED' &&
      current.paymentStatus !== 'PAID'
    ) {
      throw conflict(
        `Order cannot be marked as DELIVERED until payment is PAID`
      );
    }

    if (current.status !== status) {
      await transaction.order.update({
        where: { id },
        data: { status }
      });
    }

    const order = await transaction.order.findUnique({
      where: { id },
      select: detailSelect
    });

    return serializeDetail(order);
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
  });

module.exports = { list, findById, updateStatus };
