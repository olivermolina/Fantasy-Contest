import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';
import { Prisma, UserStatus, UserType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

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
    case UserType.AGENT:
      where.type = UserType.AGENT;
      where.id = id;
      break;
    default:
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: CustomErrorMessages.UNAUTHORIZED_ROLE,
      });
  }

  const [subAdminUsers, unAssignedAgentUsers] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: {
        AgentSubAdmins: {
          include: {
            Agent: {
              include: {
                User: {
                  include: {
                    UserAsAgents: true,
                  },
                },
                AgentSubAdmins: true,
              },
            },
          },
          ...(type === UserType.SUB_ADMIN && {
            where: {
              subAdminId: id,
            },
          }),
        },
        UserAsAgents: true,
      },
    }),
    prisma.user.findMany({
      where: {
        type: UserType.AGENT,
        UserAsAgents: {
          every: {
            AgentSubAdmins: {
              none: {},
            },
          },
        },
      },
      include: {
        UserAsAgents: true,
      },
    }),
  ]);

  if (type === UserType.AGENT) {
    return [
      {
        subAdmin: {
          id: 'unassigned',
          username: 'Unassigned',
          status: UserStatus.INACTIVE,
          type: UserType.SUB_ADMIN,
          email: '',
        },
        agents: subAdminUsers.map((row) => ({
          ...row,
          subAdminIds: [],
        })),
      },
    ];
  }

  const response = subAdminUsers.map((user) => ({
    subAdmin: {
      id: user.id,
      username: user.username,
      status: user.status,
      type: user.type,
      email: user.email,
    },
    agents: user.AgentSubAdmins?.map((agentSubAdmin) => ({
      ...agentSubAdmin.Agent.User,
      subAdminIds: agentSubAdmin.Agent.AgentSubAdmins.map(
        (row) => row.subAdminId,
      ),
    })),
  }));

  if (type === UserType.ADMIN) {
    response.unshift({
      subAdmin: {
        id: 'unassigned',
        username: 'Unassigned',
        status: UserStatus.INACTIVE,
        type: UserType.SUB_ADMIN,
        email: '',
      },
      agents: unAssignedAgentUsers.map((row) => ({
        ...row,
        subAdminIds: [],
      })),
    });
  }
  return response;
});
export default getManageUserList;
