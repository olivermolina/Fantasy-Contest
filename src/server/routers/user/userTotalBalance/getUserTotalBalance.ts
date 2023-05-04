import { Transaction, TransactionStatus } from '@prisma/client';
import prisma from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import { generateUserTotalBalancesFromTransactions } from './generateUserTotalBalancesFromTransactions';

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

/**
 * This function gets the UserTotalBalance object
 *
 * @param userId
 */
const getUserTotalBalance = async (userId: string) => {
  if (!userId) {
    return {
      totalAmount: 0,
      totalCashAmount: 0,
      creditAmount: 0,
      unPlayedAmount: 0,
      withdrawableAmount: 0,
    } as UserTotalBalanceInterface;
  }

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

export default getUserTotalBalance;
