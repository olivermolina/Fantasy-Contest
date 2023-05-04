import prisma from '~/server/prisma';

export const getUser = (userId: string | undefined) =>
  prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      UserAsAgents: {
        include: {
          users: true,
        },
      },
      SubAdminAgents: {
        include: {
          users: true,
        },
      },
    },
  });
