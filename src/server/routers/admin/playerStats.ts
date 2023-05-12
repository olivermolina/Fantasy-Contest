import { adminProcedure, UpdatedContext } from './middleware/isAdmin';
import { z } from 'zod';
import prisma from '~/server/prisma';
import { BetStatus } from '@prisma/client';
import { UserTotalBalanceInterface } from '../user/userTotalBalance/getUserTotalBalance';
import { getUserTotalBalanceBatch } from '../user/userTotalBalance/getUserTotalBalanceBatch/getUserTotalBalanceBatch';
import { setPlayerWhereFilter } from '~/server/routers/user/users';

// @ts-expect-error Big int was not supported fix here https://github.com/prisma/studio/issues/614#issuecomment-795213237
BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * Given a date range, will query a list of players and all of their bets
 * within that date range. It will then calculate the player's stats
 * and return them.
 */
export const getPlayerStats = async ({
  from,
  to,
  ctx,
}: {
  from: Date;
  to: Date;
  ctx: UpdatedContext;
}) => {
  return prisma.$transaction(
    async (trx) => {
      const where = {
        OR: [
          {
            Bets: {
              some: {
                created_at: {
                  gte: from,
                  lte: to,
                },
              },
            },
          },
          {
            Bets: {
              some: {
                updated_at: {
                  gte: from,
                  lte: to,
                },
              },
            },
          },
        ],
      };
      setPlayerWhereFilter(ctx.user, where);
      const players = await trx.user.findMany({
        where,
        include: {
          Bets: {
            where: {
              OR: [
                {
                  created_at: {
                    gte: from,
                    lte: to,
                  },
                },
                {
                  updated_at: {
                    gte: from,
                    lte: to,
                  },
                },
              ],
            },
          },
        },
      });

      const currentBalanceToUserMap = (
        await getUserTotalBalanceBatch(
          players.map((player) => player.id),
          trx,
        )
      ).map((userTotalBalance) => ({
        user: userTotalBalance.user,
        currentBalance: userTotalBalance,
      }));

      const currentBalanceMap = currentBalanceToUserMap.reduce(
        (acc, { user, currentBalance }) => {
          acc[user.id] = currentBalance;
          return acc;
        },
        {} as Record<string, UserTotalBalanceInterface>,
      );

      return players.map(async (player) => {
        const win = player.Bets.filter(
          (bet) => bet.status === BetStatus.WIN,
        ).reduce((acc, bet) => acc + bet.payout.toNumber(), 0);
        const loss = player.Bets.filter(
          (bet) => bet.status === BetStatus.LOSS,
        ).reduce((acc, bet) => {
          const number = bet.payout;
          return acc + (number.toNumber() - bet.bonusCreditStake.toNumber());
        }, 0);
        return {
          player: player.username!,
          lastWager: player.Bets[0]!.created_at.toISOString(),
          openBets: player.Bets.filter(
            (bet) => bet.status === BetStatus.PENDING,
          ).length,
          gradedBetsAmount: player.Bets.filter(
            (bet) =>
              bet.status === BetStatus.LOSS ||
              bet.status === BetStatus.WIN ||
              bet.status === BetStatus.PUSH,
          ).length,
          win,
          loss,
          net: win - loss,
          currency: 'USD',
          currentBalance: currentBalanceMap[player.id]?.totalCashAmount || 0,
        } as z.infer<typeof playerStatSchema>;
      });
    },
    {
      maxWait: 10000, // default: 2000
      timeout: 10000, // default: 5000
    },
  );
};

const playerStatSchema = z.object({
  player: z.string(),
  lastWager: z.string(),
  openBets: z.number(),
  gradedBetsAmount: z.number(),
  win: z.number(),
  loss: z.number(),
  net: z.number(),
  currency: z.string(),
  currentBalance: z.number(),
});

const outputSchema = z.array(playerStatSchema);

/**
 * Produce player total stats given a date range
 */
export const playerStats = adminProcedure
  .input(z.object({ from: z.date(), to: z.date() }))
  .output(outputSchema)
  .query(async ({ input, ctx }) => {
    const { from, to } = input;
    return await Promise.all(await getPlayerStats({ from, to, ctx }));
  });
