import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { TransactionType, PaymentMethodType } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';

/**
 * This function gets the UserTotalBalance object
 *
 * @param userId
 */
export const getUserTotalBalance = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'User not found',
    });
  }
  const transactionsWithCompleteStatus = await prisma.transaction.findMany({
    where: {
      userId,
      TransactionStatuses: {
        every: {
          statusCode: 1, // Means completed transaction
        },
      },
    },
    include: {
      TransactionStatuses: {},
      DepositDistributions: {},
    },
  });

  let totalCashDepositedAmount = 0;
  let totalBonusAmount = 0;
  let unPlayedCashAmount = 0;
  let winningsTotalAmount = 0;
  let totalAmount = 0;
  for (const transaction of transactionsWithCompleteStatus) {
    const transactionStatus = transaction.TransactionStatuses[0];
    if (!transactionStatus) continue;

    const transAmount = Number(transaction.amountProcess);
    const transBonusAmount = Number(transaction.amountBonus);
    switch (transactionStatus.transactionType) {
      // Deposit / Stake won transaction
      case TransactionType.CREDIT:
        const transactionTotalAmount = transAmount + transBonusAmount;
        totalAmount += transactionTotalAmount;
        totalCashDepositedAmount += transAmount;

        const distributionAmount = transaction.DepositDistributions?.reduce(
          (n, { amount }) => n + Number(amount),
          0,
        );

        if (transBonusAmount > distributionAmount) {
          // Increment available bonus balance
          totalBonusAmount += transBonusAmount - distributionAmount;
        }

        const distAmountLessBonus = distributionAmount - transBonusAmount;
        if (
          transAmount > 0 &&
          transAmount >= distAmountLessBonus &&
          transaction.actionType === ActionType.PAY
        ) {
          // Increment un-played cash amount
          unPlayedCashAmount += transAmount - distAmountLessBonus;
        }

        if (
          transactionStatus.transactionMethodType === PaymentMethodType.OTHERS
        ) {
          // Win transaction amount
          winningsTotalAmount += transAmount;
        }

        break;
      // Payout / Join contest / More or Less transaction
      case TransactionType.DEBIT:
        if (transaction.actionType === ActionType.PAYOUT) {
          // Decrement cash amount for every user payout
          totalCashDepositedAmount -= transAmount;
        }
        // Debit bonus amount transactions is not included
        totalAmount -= transAmount;
        break;
      default:
    }
  }

  let totalCashAmount = totalCashDepositedAmount;
  // Total cash amount must be the difference between total transaction amount and bonus amount
  if (totalCashDepositedAmount + totalBonusAmount !== totalAmount) {
    totalCashAmount = totalAmount - totalBonusAmount;
  }
  // Total cash amount must be less than or equal to available total balance
  if (totalCashAmount > totalAmount) totalCashAmount = totalAmount;
  // Total cash amount must not be less than 0
  if (totalCashAmount < 0) totalCashAmount = 0;
  let totalWithdrawableAmount = winningsTotalAmount;
  // Withdrawable amount should not be greater than the available cash amount
  if (winningsTotalAmount > totalCashAmount) {
    totalWithdrawableAmount = totalCashAmount;
  }
  // Deduct un-played cash amount from total withdrawable amount
  if (unPlayedCashAmount > 0 && totalWithdrawableAmount > 0) {
    if (totalWithdrawableAmount >= unPlayedCashAmount) {
      totalWithdrawableAmount -= unPlayedCashAmount;
    } else {
      totalWithdrawableAmount = 0;
    }
  }

  return {
    totalCashAmount,
    totalBonusAmount,
    totalWithdrawableAmount,
    unPlayedCashAmount,
    totalAmount,
  };
};

const userTotalBalance = t.procedure.query(async ({ ctx }) => {
  const userId = ctx.session.user?.id;
  if (!userId) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Invalid user id!',
    });
  }

  return getUserTotalBalance(userId);
});

export default userTotalBalance;
