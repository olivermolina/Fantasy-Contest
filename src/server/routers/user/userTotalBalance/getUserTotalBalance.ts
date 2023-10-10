import { Transaction, TransactionStatus } from '@prisma/client';
import prisma from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { MORE_OR_LESS_CONTEST_ID } from '~/constants/MoreOrLessContestId';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import { generateUserTotalBalancesFromTransactions } from '~/server/routers/user/userTotalBalance/generateUserTotalBalancesFromTransactions';

export type TransactionStatusWithTransaction = TransactionStatus & {
  Transaction: Transaction;
};

export interface UserTotalBalanceInterface {
  totalAmount: number;
  totalCashAmount: number;
  creditAmount: number;
  unPlayedAmount: number;
  withdrawableAmount: number;
}

const defaultUserBalance = {
  totalAmount: 0,
  totalCashAmount: 0,
  creditAmount: 0,
  unPlayedAmount: 0,
  withdrawableAmount: 0,
} as UserTotalBalanceInterface;

/**
 * @deprecated
 *
 *  This function gets the UserTotalBalance object from transactions
 *
 * @param userId
 */

const getUserTotalBalanceFromTransactions = async (userId: string) => {
  const transactionStatuses = await prisma.transactionStatus.findMany({
    where: {
      Transaction: {
        userId,
      },
      statusCode: {
        in: [PaymentStatusCode.PENDING, PaymentStatusCode.COMPLETE],
      },
    },
    include: {
      Transaction: true,
    },
    orderBy: {
      Transaction: {
        created_at: 'asc',
      },
    },
  });

  return generateUserTotalBalancesFromTransactions(transactionStatuses);
};

/**
 * This function gets the UserTotalBalance object
 *
 * @param userId
 */
const getUserTotalBalance = async (userId: string) => {
  if (!userId) {
    return defaultUserBalance;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: CustomErrorMessages.USER_NOT_FOUND,
    });
  }

  const wallet = await prisma.wallets.findFirst({
    where: {
      userId,
      contestsId: MORE_OR_LESS_CONTEST_ID,
    },
  });

  if (!wallet) {
    return defaultUserBalance;
  }

  return {
    totalAmount: Number(wallet.balance),
    totalCashAmount: Number(wallet.cashBalance),
    creditAmount: Number(wallet.bonusCredits),
    unPlayedAmount: Number(wallet.unPlayedAmount),
    withdrawableAmount: Number(wallet.amountAvailableToWithdraw),
  } as UserTotalBalanceInterface;
};

export default getUserTotalBalance;
