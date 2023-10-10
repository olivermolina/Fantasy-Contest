import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import en from 'dayjs/locale/en';
import { IPlayerWithBetsAndTransactions } from '../weeklyBalances/weeklyBalances';
import { Bet, BetStatus } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import { getUserTotalBalance } from '~/server/routers/user/userTotalBalance';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import getWeeksInMonth from '~/utils/getWeeksInMonth';
import { BalanceDateRage } from '~/server/routers/admin/figures/weeklyBalances/playerWeeklyBalance';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);
dayjs.extend(isBetween);
dayjs.locale({
  ...en,
  weekStart: 1,
});
dayjs.tz.setDefault('America/New_York');

interface IPlayerWeeklyBalancesInput {
  player: IPlayerWithBetsAndTransactions;
  dateRange: BalanceDateRage;
  includeEntryFee?: boolean;
  timezone?: string;
}

/**
 * Will get the player picks total balance by specific date range
 *
 * @param montlyPicks {Bet[]} - Player bet list
 * @param dateRange - The entry date range object
 * @param includeEntryFee - Include entry fee from winnings calculations
 * @returns {number} - return the picks total balance
 *
 */
function getPickBalanceByDateRange(
  montlyPicks: Bet[],
  dateRange: { start: Dayjs; end: Dayjs },
  includeEntryFee: boolean,
): number {
  const entryDatePicks = montlyPicks.filter((pick) =>
    dayjs(pick.updated_at).isBetween(
      dateRange.start,
      dateRange.end,
      'day',
      '[]',
    ),
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
 * Will get the player monthly balances
 *
 * @param player - IPlayerWithBetsAndTransactions.
 * @param dateRange - The entry date range object
 * @param includeEntryFee - Include entry fee from winnings calculations
 *
 */
export const playerMonthlyBalance = async ({
  player,
  dateRange,
  includeEntryFee = false,
}: IPlayerWeeklyBalancesInput) => {
  const pendingPicks = player.Bets.filter(
    (bet) => bet.status === BetStatus.PENDING,
  );

  const settledPicks = player.Bets.filter(
    (bet) => bet.status !== BetStatus.PENDING,
  );

  // Deposit/Payout transactions
  const transactions = player.Transactions;

  const userTotalBalance = await getUserTotalBalance(player.id);

  const isActive =
    settledPicks.length > 0 ||
    pendingPicks.length > 0 ||
    transactions.length > 0;

  const month = dayjs(dateRange.from).month() + 1;
  const year = dayjs(dateRange.from).year();
  const weeksInMonth = getWeeksInMonth(month, year);
  const weekColumns = weeksInMonth.reduce((acc: any, curr, index) => {
    if (!acc) {
      acc = {};
    }
    acc['week' + (index + 1)] = {
      from: curr.start,
      to: curr.end,
      balance: getPickBalanceByDateRange(settledPicks, curr, includeEntryFee),
    };
    return acc;
  }, {});

  return {
    ...weekColumns,
    totalMonthlyBalance: settledPicks.reduce(
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
