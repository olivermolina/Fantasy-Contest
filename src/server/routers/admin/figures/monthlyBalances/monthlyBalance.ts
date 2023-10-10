import prisma from '~/server/prisma';
import { Agent, BetStatus, Prisma, User } from '@prisma/client';
import {
  adminProcedure,
  UpdatedContext,
} from '~/server/routers/admin/middleware/isAdmin';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekday from 'dayjs/plugin/weekday';
import en from 'dayjs/locale/en';
import { linkUserToAgent } from '~/server/routers/user/linkUserToAgent';
import { setPlayerWhereFilter } from '~/server/routers/user/users';
import { ActionType } from '~/constants/ActionType';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import { z } from 'zod';
import { playerMonthlyBalance } from '~/server/routers/admin/figures/monthlyBalances/playerMonthlyBalances';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);
dayjs.locale({
  ...en,
  weekStart: 1,
});

export type AgentWithUser = Agent & { User?: User };

export type IPlayerWithAgent = Pick<
  User,
  'id' | 'username' | 'firstname' | 'lastname' | 'isFirstDeposit' | 'referral'
> & {
  agent: AgentWithUser | null;
};

export type IPlayerWeeklyBalance = IPlayerWithAgent & {
  mondayBalance: number;
  tuesdayBalance: number;
  wednesdayBalance: number;
  thursdayBalance: number;
  fridayBalance: number;
  saturdayBalance: number;
  sundayBalance: number;
  totalWeekBalance: number;
  deposits: number;
  withdrawals: number;
  pendingTotal: number;
  cashAmount: number;
  withdrawable: number;
  creditAmount: number;
  totalBalance: number;
  isActive: boolean;
};

export const innerFn = async ({
  input,
  ctx,
}: {
  input: { date: string; includeInactive?: boolean; includeEntryFee?: boolean };
  ctx: UpdatedContext;
}) => {
  // Link the users to the agent if it's not yet connected to support
  // the multiple referral code report
  await linkUserToAgent();

  const fromDateString = dayjs(input.date)
    .startOf('month')
    .format('YYYY-MM-DD');
  const toDateString = dayjs(input.date).endOf('month').format('YYYY-MM-DD');

  const dateRange = {
    from: fromDateString,
    to: toDateString,
  };

  const startDate = dayjs.tz(dateRange.from, 'America/New_York').toDate();
  const endDate = dayjs.tz(dateRange.to, 'America/New_York').toDate();
  // Add 1 day to the end date to include all bets for the end date
  endDate.setDate(endDate.getDate() + 1);

  const dateRangeInput = {
    gte: startDate,
    lte: endDate,
  };

  const where: Prisma.UserWhereInput = {};
  setPlayerWhereFilter(ctx.user, where);
  const players = await prisma.user.findMany({
    where,
    include: {
      agent: {
        include: { User: true },
      },
      Bets: {
        where: {
          OR: [
            {
              status: BetStatus.PENDING,
            },
            {
              updated_at: dateRangeInput,
              status: {
                in: [BetStatus.WIN, BetStatus.LOSS],
              },
            },
          ],
        },
      },
      Transactions: {
        where: {
          actionType: {
            in: [ActionType.PAY, ActionType.PAYOUT],
          },
          created_at: dateRangeInput,
          TransactionStatuses: {
            every: {
              statusCode: {
                in: [PaymentStatusCode.PENDING, PaymentStatusCode.COMPLETE],
              },
            },
          },
          NOT: {
            TransactionStatuses: {
              none: {},
            },
          },
        },
        include: {
          TransactionStatuses: true,
        },
      },
    },
  });

  const activePlayers = players.filter(
    (player) => player.Bets.length > 0 || player.Transactions.length > 0,
  );

  const inactivePlayers = players.filter(
    (player) => player.Bets.length === 0 && player.Transactions.length === 0,
  );

  const playerList = input.includeInactive ? players : activePlayers;

  const monthlyBalances = await Promise.all(
    playerList.map(async (player) => {
      const monthlyBalances = await playerMonthlyBalance({
        player,
        dateRange,
        includeEntryFee: input.includeEntryFee,
      });
      return { ...player, ...monthlyBalances };
    }),
  );
  return {
    dateRange,
    monthlyBalances,
    activeCount: activePlayers.length,
    inactiveCount: inactivePlayers.length,
  };
};

/**
 * Will get the users monthly balances
 * @function
 * @async
 * @param {Object} input - Input object containing the report date
 * @param {string} input.date - Weekly balance report date string
 */

const monthlyBalance = adminProcedure
  .input(
    z.object({
      date: z.string(),
      includeInactive: z.boolean().optional(),
      includeEntryFee: z.boolean().optional(),
    }),
  )
  .query(innerFn);
export default monthlyBalance;
