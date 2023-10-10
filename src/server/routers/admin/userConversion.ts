import { adminProcedure, UpdatedContext } from './middleware/isAdmin';
import { z } from 'zod';
import prisma from '~/server/prisma';
import { Prisma } from '@prisma/client';
import { setPlayerWhereFilter } from '~/server/routers/user/users';
import { ActionType } from '~/constants/ActionType';
import dayjs from 'dayjs';

/**
 * Given a date range, will query a list of players
 * within that date range
 */
export const getUserConversion = async ({
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
      const where: Prisma.UserWhereInput = {
        created_at: {
          gte: from,
          lte: to,
        },
      };
      setPlayerWhereFilter(ctx.user, where);
      const players = await trx.user.findMany({
        where,
        include: {
          Transactions: {
            where: {
              TransactionStatuses: {
                every: {
                  statusCode: 1,
                },
              },
              NOT: {
                TransactionStatuses: {},
              },
              actionType: {
                in: [ActionType.PAY],
              },
            },
          },
        },
      });

      return players.map((player) => {
        const depositedDate = player.Transactions?.[0]?.created_at;

        return {
          id: player.id,
          name: `${player.firstname || ''} ${player.lastname || ''}`,
          username: player.username || '',
          referral: player.referral || '',
          signupDate: dayjs(player.created_at).format('YYYY-MM-DD'),
          deposited: player.isFirstDeposit ? 'No' : 'Yes',
          depositedDate:
            depositedDate && !player.isFirstDeposit
              ? dayjs(depositedDate).format('YYYY-MM-DD')
              : 'NA',
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
  id: z.string(),
  name: z.string(),
  username: z.string(),
  referral: z.string(),
  signupDate: z.string(),
  deposited: z.string(),
  depositedDate: z.string(),
});

const outputSchema = z.array(playerStatSchema);

/**
 * Produce user conversion by sign-up date
 */
export const userConversion = adminProcedure
  .input(z.object({ from: z.date(), to: z.date() }))
  .output(outputSchema)
  .query(async ({ input, ctx }) => {
    const { from, to } = input;
    return await Promise.all(await getUserConversion({ from, to, ctx }));
  });
