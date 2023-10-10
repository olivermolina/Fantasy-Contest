import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import en from 'dayjs/locale/en';
import { IPlayerWithBetsAndTransactions } from './weeklyBalances';
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
dayjs.tz.setDefault('America/New_York');

export interface BalanceDateRage {
  from: string;
  to: string;
}

interface IPlayerWeeklyBalancesInput {
  player: IPlayerWithBetsAndTransactions;
  dateRange: BalanceDateRage;
  includeEntryFee?: boolean;
  timezone?: string;
}

/**
 * Will get the player picks total balance by specific date
 *
 * @param weeklyPicks {Bet[]} - Player bet list
 * @param entryDate - The entry date
 * @param includeEntryFee - Include entry fee from winnings calculations
 * @returns {number} - return the picks total balance
 *
 */
function getPickBalanceByDate(
  weeklyPicks: Bet[],
  entryDate: Dayjs,
  includeEntryFee: boolean,
): number {
  const entryDatePicks = weeklyPicks.filter((pick) =>
    entryDate.isSame(pick.updated_at, 'day'),
  );
  return entryDatePicks.reduce(
    (acc, curr) =>
      acc +
      (curr.status === BetStatus.LOSS
        ? // Don't include play free bonus credit stake as losses
          (Number(curr.stake) - Number(curr.bonusCreditStake)) * -1
        : Number(
            curr.status === BetStatus.WIN
              ? includeEntryFee
                ? curr.payout
                : Number(curr.payout) - Number(curr.stake)
              : curr.stake,
          )),
    0,
  );
}

/**
 * Will get the player weekly balances
 *
 * @param player - IPlayerWithBetsAndTransactions.
 * @param dateRange - The entry date range object
 * @param includeEntryFee - Include entry fee from winnings calculations
 * @param timezone - The timezone string
 * @returns {Object} - Returns an IPlayerWeeklyBalance object
 *
 */
export const playerWeeklyBalance = async ({
  player,
  dateRange,
  includeEntryFee = false,
  timezone = USATimeZone['America/New_York'],
}: IPlayerWeeklyBalancesInput) => {
  const pendingPicks = player.Bets.filter(
    (pick) => pick.status === BetStatus.PENDING,
  );

  const settledPicks = player.Bets.filter(
    (pick) => pick.status !== BetStatus.PENDING,
  );

  // Deposit/Payout transactions
  const transactions = player.Transactions;

  const userTotalBalance = await getUserTotalBalance(player.id);

  const isActive =
    settledPicks.length > 0 ||
    pendingPicks.length > 0 ||
    transactions.length > 0;

  return {
    mondayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs.tz(dateRange.from, timezone).weekday(DayOfWeek.MONDAY),
      includeEntryFee,
    ),
    tuesdayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs.tz(dateRange.from, timezone).weekday(DayOfWeek.TUESDAY),
      includeEntryFee,
    ),
    wednesdayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs.tz(dateRange.from, timezone).weekday(DayOfWeek.WEDNESDAY),
      includeEntryFee,
    ),
    thursdayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs.tz(dateRange.from, timezone).weekday(DayOfWeek.THURSDAY),
      includeEntryFee,
    ),
    fridayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs.tz(dateRange.from, timezone).weekday(DayOfWeek.FRIDAY),
      includeEntryFee,
    ),
    saturdayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs.tz(dateRange.from, timezone).weekday(DayOfWeek.SATURDAY),
      includeEntryFee,
    ),
    sundayBalance: getPickBalanceByDate(
      settledPicks,
      dayjs.tz(dateRange.from, timezone).weekday(DayOfWeek.SUNDAY),
      includeEntryFee,
    ),
    totalWeekBalance: settledPicks.reduce(
      (acc, curr) =>
        acc +
        (curr.status === BetStatus.LOSS
          ? (Number(curr.stake) - Number(curr.bonusCreditStake)) * -1
          : Number(
              curr.status === BetStatus.WIN
                ? includeEntryFee
                  ? curr.payout
                  : Number(curr.payout) - Number(curr.stake)
                : curr.stake,
            )),
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
