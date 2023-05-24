import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import en from 'dayjs/locale/en';
import { IPlayerWithAgent } from '~/server/routers/admin/figures/weeklyBalances/weeklyBalances';
import prisma from '~/server/prisma';
import { Bet, BetStatus } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import { DayOfWeek } from '~/constants/DayOfWeek';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import { getUserTotalBalance } from '~/server/routers/user/userTotalBalance';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { USATimeZone } from '~/constants/USATimeZone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);
dayjs.locale({
  ...en,
  weekStart: 1,
});

export interface WeeklyBalanceDateRage {
  from: string;
  to: string;
}

interface IPlayerWeeklyBalancesInput {
  player: IPlayerWithAgent;
  dateRange: WeeklyBalanceDateRage;
  timezone?: string;
}

/**
 * Will get the player picks total balance by specific date
 *
 * @param weeklyPicks {Bet[]} - Player bet list
 * @param entryDate - The entry date
 * @returns {number} - return the picks total balance
 *
 */
function getPickBalanceByDate(weeklyPicks: Bet[], entryDate: Date): number {
  const entryDatePicks = weeklyPicks.filter((pick) =>
    dayjs(entryDate).isSame(pick.updated_at, 'day'),
  );
  return entryDatePicks.reduce(
    (acc, curr) =>
      acc +
      (curr.status === BetStatus.LOSS
        ? // Don't include play free bonus credit stake as losses
          (Number(curr.stake) - Number(curr.bonusCreditStake)) * -1
        : Number(curr.status === BetStatus.WIN ? curr.payout : curr.stake)),
    0,
  );
}

/**
 * Will get the player weekly balances
 *
 * @param player - User object representing as a player type.
 * @param dateRange - The entry date range object
 * @param timezone - The timezone string
 * @returns {Object} - Returns an IPlayerWeeklyBalance object
 *
 */
export const playerWeeklyBalance = async ({
  player,
  dateRange,
  timezone = USATimeZone['America/New_York'],
}: IPlayerWeeklyBalancesInput) => {
  // Weekly settled/pending picks
  const weeklyPicks = await prisma.bet.findMany({
    where: {
      userId: player.id,
      updated_at: {
        gte: dayjs(`${dateRange.from} 00:00:00`).tz(timezone).toDate(),
        lte: dayjs(`${dateRange.to} 23:59:59`).tz(timezone).toDate(),
      },
      NOT: {
        status: BetStatus.PENDING,
      },
    },
  });
  const pendingPicks = await prisma.bet.findMany({
    where: {
      userId: player.id,
      status: BetStatus.PENDING,
    },
  });

  const settledPicks = weeklyPicks.filter(
    (pick) => pick.status !== BetStatus.PENDING,
  );

  // Deposit/Payout transactions
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: player.id,
      actionType: {
        in: [ActionType.PAY, ActionType.PAYOUT],
      },
      created_at: {
        gte: dayjs(`${dateRange.from} 00:00:00`).tz(timezone).toDate(),
        lte: dayjs(`${dateRange.to} 23:59:59`).tz(timezone).toDate(),
      },
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
  });

  const userTotalBalance = await getUserTotalBalance(player.id);

  const isActive =
    settledPicks.length > 0 ||
    pendingPicks.length > 0 ||
    transactions.length > 0;

  return {
    mondayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs(dateRange.from).weekday(DayOfWeek.MONDAY).toDate(),
    ),
    tuesdayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs(dateRange.from).weekday(DayOfWeek.TUESDAY).toDate(),
    ),
    wednesdayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs(dateRange.from).weekday(DayOfWeek.WEDNESDAY).toDate(),
    ),
    thursdayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs(dateRange.from).weekday(DayOfWeek.THURSDAY).toDate(),
    ),
    fridayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs(dateRange.from).weekday(DayOfWeek.FRIDAY).toDate(),
    ),
    saturdayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs(dateRange.from).weekday(DayOfWeek.SATURDAY).toDate(),
    ),
    sundayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs(dateRange.from).weekday(DayOfWeek.SUNDAY).toDate(),
    ),
    totalWeekBalance: settledPicks.reduce(
      (acc, curr) =>
        acc +
        (curr.status === BetStatus.LOSS
          ? (Number(curr.stake) - Number(curr.bonusCreditStake)) * -1
          : Number(curr.status === BetStatus.WIN ? curr.payout : curr.stake)),
      0,
    ),
    deposits: transactions
      .filter(
        (transaction) =>
          transaction.actionType === ActionType.PAY &&
          transaction.TransactionStatuses.every(
            (transactionStatus) =>
              transactionStatus.statusCode === PaymentStatusCode.COMPLETE,
          ),
      )
      .reduce((acc, curr) => acc + Number(curr.amountProcess), 0),
    withdrawals: transactions
      .filter(
        (transaction) =>
          transaction.actionType === ActionType.PAYOUT &&
          transaction.TransactionStatuses.every(
            (transactionStatus) =>
              transactionStatus.statusCode === PaymentStatusCode.COMPLETE ||
              transactionStatus.statusCode === PaymentStatusCode.PENDING,
          ),
      )
      .reduce((acc, curr) => acc + Number(curr.amountProcess), 0),
    pendingTotal: pendingPicks
      .filter((transaction) => transaction.status === BetStatus.PENDING)
      .reduce((acc, curr) => acc + Number(curr.stake), 0),
    cashAmount: userTotalBalance.totalCashAmount,
    withdrawable: userTotalBalance.withdrawableAmount,
    creditAmount: userTotalBalance.creditAmount,
    totalBalance: userTotalBalance.totalAmount,
    isActive,
  };
};
