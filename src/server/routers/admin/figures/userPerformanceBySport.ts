import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import * as yup from '~/utils/yup';
import prisma from '~/server/prisma';
import dayjs from 'dayjs';
import { BetStatus, League, Prisma } from '@prisma/client';
import { setPlayerWhereFilter } from '~/server/routers/user/users';

const userPerformanceBySport = adminProcedure
  .input(
    yup.object({
      from: yup.string().required(),
      to: yup.string().required(),
      includeFreeCreditStake: yup.boolean(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { includeFreeCreditStake, from, to } = input;
    const startDate = dayjs.tz(from, 'America/New_York').toDate();
    const endDate = dayjs.tz(to, 'America/New_York').toDate();
    // Add 1 day to the end date to include all bets for the end date
    endDate.setDate(endDate.getDate() + 1);

    const dateRangeInput = {
      gte: startDate,
      lte: endDate,
    };

    return await prisma.$transaction(async (trx) => {
      const where: Prisma.UserWhereInput = {};
      setPlayerWhereFilter(ctx.user, where);
      const players = await trx.user.findMany({
        where,
      });

      const bets = await trx.bet.findMany({
        where: {
          updated_at: dateRangeInput,
          userId: {
            in: players.map((player) => player.id),
          },
        },
        include: {
          owner: true,
          legs: {
            include: {
              market: {
                include: {
                  offer: true,
                },
              },
            },
          },
        },
      });
      const betsByPlayer = bets.reduce((acc, bet) => {
        const userId = bet.userId;
        if (!acc[userId]) {
          acc[userId] = [];
        }
        acc[userId]?.push(bet);
        return acc;
      }, {} as Record<string, (typeof bets)[0][]>);

      const betsByPlayerByLeague = Object.entries(betsByPlayer).map(
        ([userId, bets]) => {
          const row: Record<string | League, any> = { ...bets[0]!.owner };
          for (const league of Object.keys(League)) {
            row[league] = bets
              .filter((bet) =>
                bet.legs?.find((leg) => leg.market!.offer!.league === league),
              )
              .reduce((acc, bet) => {
                if (bet.status === BetStatus.WIN) {
                  return acc + Number(bet.payout);
                }

                if (
                  bet.status === BetStatus.LOSS &&
                  (Number(bet.bonusCreditStake) === 0 || includeFreeCreditStake) // Only count losses that were not bonus credit used if includeFreeCreditStake is false
                ) {
                  return acc - Number(bet.stake);
                }

                return acc;
              }, 0);
          }

          row['total'] = bets.reduce((acc, bet) => {
            if (bet.status === BetStatus.WIN) {
              return acc + Number(bet.payout);
            }

            if (
              bet.status === BetStatus.LOSS &&
              (Number(bet.bonusCreditStake) === 0 || includeFreeCreditStake) // Only count losses that were not bonus credit used if includeFreeCreditStake is false
            ) {
              return acc - Number(bet.stake);
            }

            return acc;
          }, 0);

          return row;
        },
      );

      return betsByPlayerByLeague;
    });
  });
export default userPerformanceBySport;
