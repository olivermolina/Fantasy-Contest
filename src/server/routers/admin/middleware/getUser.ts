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
      AgentSubAdmins: {
        include: {
          Agent: {
            include: {
              users: true,
              User: true,
            },
          },
        },
      },
    },
  });
