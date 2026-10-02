const { Prisma } = require('@prisma/client');

const prisma = require('../config/prisma');

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true
};

const notFound = () => {
  const error = new Error('User not found');
  error.statusCode = 404;
  return error;
};

const conflict = (message) => {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
};

const list = async ({ page, limit, search }) => {
  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } }
        ]
      }
    : {};
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      select: safeUserSelect
    }),
    prisma.user.count({ where })
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const findById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: safeUserSelect
  });

  if (!user) {
    throw notFound();
  }

  return user;
};

const updateRole = async (adminId, targetId, role) =>
  prisma.$transaction(
    async (transaction) => {
      const target = await transaction.user.findUnique({
        where: { id: targetId },
        select: safeUserSelect
      });

      if (!target) {
        throw notFound();
      }

      if (adminId === targetId) {
        throw conflict('Admins cannot change their own role');
      }

      if (target.role === role) {
        return target;
      }

      if (target.role === 'ADMIN' && role === 'USER') {
        const adminCount = await transaction.user.count({ where: { role: 'ADMIN' } });

        if (adminCount <= 1) {
          throw conflict('Cannot demote the last remaining admin');
        }
      }

      return transaction.user.update({
        where: { id: targetId },
        data: { role },
        select: safeUserSelect
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );

module.exports = { list, findById, updateRole };