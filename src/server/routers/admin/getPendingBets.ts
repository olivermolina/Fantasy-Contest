import { adminProcedure, UpdatedContext } from './middleware/isAdmin';
import { z } from 'zod';
import prisma from '~/server/prisma';
import { describeParlayBet } from '~/utils/describeParlayBet';
import { Prisma, User, UserType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

// @ts-expect-error Big int was not supported fix here https://github.com/prisma/studio/issues/614#issuecomment-795213237
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const getUserBetLists = async (
  where: Prisma.BetWhereInput,
  ctx: UpdatedContext,
) => {
  switch (ctx.user.type) {
    case UserType.ADMIN:
      break;
    case UserType.SUB_ADMIN:
      where.userId = {
        in: [
          ...ctx.user.SubAdminAgents.reduce((acc: string[], subAdmin) => {
            return [...acc, ...subAdmin.users?.map((user: User) => user.id)];
          }, []),
        ],
      };
      break;
    case UserType.AGENT:
      where.userId = {
        in: [
          ...ctx.user.UserAsAgents.reduce((acc: string[], agent) => {
            return [...acc, ...agent.users?.map((user: User) => user.id)];
          }, []),
        ],
      };
      break;
    default:
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User does not have role permissions for this function.',
      });
  }

  const bets = await prisma.bet.findMany({
    where,
    orderBy: {
      created_at: 'desc',
    },
    include: {
      owner: {
        select: {
          phone: true,
          username: true,
          firstname: true,
          lastname: true,
        },
      },
      legs: {
        include: {
          market: true,
        },
      },
    },
  });
  return bets.map((bet) => ({
    ticket: bet.id,
    status: bet.status,
    placed: bet.created_at,
    username: bet.owner.username || '',
    name: `${bet.owner.firstname || ''} ${bet.owner.lastname || ''}`,
    userPhone: bet.owner.phone?.toString() ?? '',
    riskWin: `${bet.stake} / ${bet.payout}`,
    description: describeParlayBet({ legs: bet.legs }),
    type: bet.type,
    legs: bet.legs.map((leg) => ({
      id: leg.id,
      name: leg.market.name,
      type: leg.type.toString(),
      odds: Number(leg.odds),
      category: leg.market.category,
      total: Number(leg.total),
    })),
  }));
};

const getPendingBets = adminProcedure
  .output(
    z.array(
      z.object({
        ticket: z.string(),
        placed: z.date(),
        userPhone: z.string(),
        name: z.string(),
        username: z.string(),
        description: z.string(),
        riskWin: z.string(),
        status: z.string(),
        type: z.string(),
        legs: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            type: z.string(),
            odds: z.number(),
            category: z.string(),
            total: z.number(),
          }),
        ),
      }),
    ),
  )
  .query(async ({ ctx }) => {
    return getUserBetLists({ status: 'PENDING' }, ctx);
  });

export default getPendingBets;
