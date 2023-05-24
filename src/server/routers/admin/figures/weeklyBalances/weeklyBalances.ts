import * as yup from '~/utils/yup';
import prisma from '~/server/prisma';
import { Agent, Prisma, User } from '@prisma/client';
import { playerWeeklyBalance } from './playerWeeklyBalance';
import {
  adminProcedure,
  UpdatedContext,
} from '~/server/routers/admin/middleware/isAdmin';
import dayjs from 'dayjs';
import { DayOfWeek } from '~/constants/DayOfWeek';
import weekday from 'dayjs/plugin/weekday';
import en from 'dayjs/locale/en';
import { linkUserToAgent } from '~/server/routers/user/linkUserToAgent';
import { setPlayerWhereFilter } from '~/server/routers/user/users';

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
  input: { date: string };
  ctx: UpdatedContext;
}) => {
  // Link the users to the agent if it's not yet connected to support
  // the multiple referral code report
  await linkUserToAgent();

  const where: Prisma.UserWhereInput = {};
  setPlayerWhereFilter(ctx.user, where);
  const players = await prisma.user.findMany({
    where,
    include: {
      agent: {
        include: { User: true },
      },
    },
  });

  const fromDateString = dayjs(input.date)
    .weekday(DayOfWeek.MONDAY)
    .format('YYYY-MM-DD');
  const toDateString = dayjs(input.date)
    .weekday(DayOfWeek.SUNDAY)
    .format('YYYY-MM-DD');

  const dateRange = {
    from: fromDateString,
    to: toDateString,
  };

  const weeklyBalances: IPlayerWeeklyBalance[] = await Promise.all(
    players.map(async (player) => {
      const weeklyBalances = await playerWeeklyBalance({
        player,
        dateRange,
        timezone: ctx.user.timezone!,
      });
      return { ...player, ...weeklyBalances };
    }),
  );
  return {
    dateRange,
    weeklyBalances,
  };
};

/**
 * Will get the users weekly balances
 * @function
 * @async
 * @param {Object} input - Input object containing the report date
 * @param {string} input.date - Weekly balance report date string
 * @returns {IPlayerWeeklyBalance[]}
 */

const weeklyBalances = adminProcedure
  .input(
    yup.object({
      date: yup.string().required(),
    }),
  )
  .query(innerFn);
export default weeklyBalances;
