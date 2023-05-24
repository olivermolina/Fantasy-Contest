import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import { prisma } from '~/server/prisma';
import { Prisma, User, UserType } from '@prisma/client';
import { z } from 'zod';
import type { AgentUsersType } from '~/server/routers/admin/middleware/isAdmin';

// @ts-expect-error Big int was not supported fix here https://github.com/prisma/studio/issues/614#issuecomment-795213237
BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * Set the where filter for the player query
 * @param user - User object
 * @param where - Prisma.UserWhereInput
 */
export const setPlayerWhereFilter = (
  user: User & {
    UserAsAgents: AgentUsersType[];
    SubAdminAgents: AgentUsersType[];
  },
  where: Prisma.UserWhereInput = {},
) => {
  where.type = UserType.PLAYER;
  where.NOT = { id: user.id };
  switch (user.type) {
    case UserType.ADMIN:
      // Do nothing
      break;
    case UserType.SUB_ADMIN:
      // Get all players under the sub admin agents
      where.agentId = {
        in: user.SubAdminAgents.map((agent) => agent.id),
      };
      break;
    case UserType.AGENT:
      // Get users under the agent
      where.agentId = {
        in: user.UserAsAgents.map((agent) => agent.id),
      };
      break;
    default:
  }
};

const users = t.procedure
  .input(
    z
      .object({
        userType: z.nativeEnum(UserType).optional(),
      })
      .optional(),
  )
  .query(async ({ input, ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    const userId = ctx.session.user?.id;
    const user = await prisma.user.findUnique({
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
    if (!user) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      });
    }

    const where: Prisma.UserWhereInput = {};
    if (!input?.userType || input?.userType === UserType.PLAYER) {
      setPlayerWhereFilter(user, where);
    } else if (input?.userType === UserType.AGENT) {
      where.type = UserType.AGENT;

      switch (user.type) {
        case UserType.ADMIN:
          // Do nothing
          break;
        case UserType.SUB_ADMIN:
          // Get all agents under the sub admin
          where.id = {
            in: user.SubAdminAgents.map((agent) => agent.userId),
          };
          break;
        case UserType.AGENT:
          // return the agent itself
          where.id = userId;
          break;
        default:
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `You don't have permission to access the user list`,
          });
      }
    }

    return await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        referral: true,
        referralCodes: true,
        type: true,
        phone: true,
        DOB: true,
        firstname: true,
        lastname: true,
        address1: true,
        address2: true,
        city: true,
        state: true,
        postalCode: true,
        status: true,
        isFirstDeposit: true,
        created_at: true,
      },
    });
  });

export default users;
