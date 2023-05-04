import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';
import { Prisma, UserStatus, UserType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

const getManageUserList = adminProcedure.query(async ({ ctx }) => {
  const { type, id } = ctx.user;
  const where: Prisma.UserWhereInput = {};
  switch (type) {
    // Get all sub admins and their agents
    case UserType.ADMIN:
      where.type = UserType.SUB_ADMIN;
      break;
    // Get all agents for the sub admin
    case UserType.SUB_ADMIN:
      where.type = UserType.SUB_ADMIN;
      where.id = id;
      break;
    default:
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User does not have role permissions for this function.',
      });
  }

  const [subAdminUsers, unAssignedAgentUsers] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: {
        SubAdminAgents: {
          include: {
            User: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      where: {
        type: UserType.AGENT,
        UserAsAgents: {
          every: {
            subAdminId: null,
          },
        },
      },
      include: {
        SubAdminAgents: {
          include: {
            User: true,
          },
        },
      },
    }),
  ]);

  return [
    {
      subAdmin: {
        id: 'unassigned',
        username: 'Unassigned',
        status: UserStatus.INACTIVE,
      },
      agents: unAssignedAgentUsers,
    },
    ...subAdminUsers.map((user) => ({
      subAdmin: user,
      agents: user.SubAdminAgents?.map((agent) => ({
        ...agent.User,
      })),
    })),
  ];
});

export default getManageUserList;
