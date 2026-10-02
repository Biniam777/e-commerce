const prisma = require('../config/prisma');

const orderStatuses = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

const get = async () => {
  const [users, products, categories, orders, groupedStatuses, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.groupBy({
      by: ['status'],
      _count: { _all: true }
    }),
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true }
    })
  ]);

  const ordersByStatus = Object.fromEntries(orderStatuses.map((status) => [status, 0]));

  for (const group of groupedStatuses) {
    ordersByStatus[group.status] = group._count._all;
  }

  return {
    counts: {
      users,
      products,
      categories,
      orders
    },
    ordersByStatus,
    revenue: revenue._sum.total ? revenue._sum.total.toFixed(2) : '0.00'
  };
};

module.exports = { get };