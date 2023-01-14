import { Transaction, TransactionStatus } from '@prisma/client';
import prisma from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import calculateCredits from './calculateCredits';
import calculateUnPlayedAmount from './calculateUnPlayedAmount';
import calculateWithdrawableAmount from './calculateWithdrawableAmount';
import calculateTotalAmount from '~/server/routers/user/userTotalBalance/calculateTotalAmount';

export type TransactionStatusWithTransaction = TransactionStatus & {
  Transaction: Transaction;
};

export enum PaymentStatusCode {
  PAYMENT_NOT_FOUND = -1,
  PENDING = 0,
  COMPLETE = 1,
  INELIGIBLE = 2,
  FAILED = 3,
  PROCESSING = 4,
  REVERSED = 5,
  CANCELLED = 6,
}

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

  let creditAmount = 0;
  let unPlayedAmount = 0;
  let withdrawableAmount = 0;
  let totalAmount = 0;
  for (const transactionStatus of transactionStatuses) {
    totalAmount = calculateTotalAmount(transactionStatus, totalAmount);
    creditAmount = calculateCredits(
      transactionStatus,
      creditAmount,
      totalAmount,
    );
    unPlayedAmount = calculateUnPlayedAmount(
      transactionStatus,
      unPlayedAmount,
      creditAmount,
    );
    withdrawableAmount = calculateWithdrawableAmount(
      transactionStatus,
      withdrawableAmount,
    );
  }

  // Finalize balances
  const totalCashAmount =
    totalAmount > creditAmount ? totalAmount - creditAmount : 0;

  return {
    totalAmount,
    totalCashAmount,
    creditAmount,
    unPlayedAmount,
    withdrawableAmount,
  } as UserTotalBalanceInterface;
};

export default getUserTotalBalance;
