import { Prisma, User } from '@prisma/client';
import prisma from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import {
  TransactionStatusWithTransaction,
  UserTotalBalanceInterface,
} from '../getUserTotalBalance';
import { generateUserTotalBalancesFromTransactions } from '../generateUserTotalBalancesFromTransactions';

/**
 * This function gets the UserTotalBalance object
 * for a batch of users
 *
 * @param userIds - array of user ids
 * @param trx - transaction client
 */
export const getUserTotalBalanceBatch = async (
  userIds: string[],
  trx?: Prisma.TransactionClient,
): Promise<(UserTotalBalanceInterface & { user: User })[]> => {
  const prismaClient = trx || prisma;
  if (!userIds || userIds.length === 0) {
    return [] as (UserTotalBalanceInterface & { user: User })[];
  }
  const users = await prismaClient.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    include: {
      Transactions: {
        where: {
          TransactionStatuses: {
            some: {
              statusCode: {
                in: [PaymentStatusCode.PENDING, PaymentStatusCode.COMPLETE],
              },
            },
          },
        },
        include: {
          TransactionStatuses: {
            orderBy: {
              created_at: 'asc',
            },
          },
        },
      },
    },
  });
  if (!users) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'User not found',
    });
  }
  const userTotalBalances = await Promise.all(
    users.map(async (user) => {
      const transactionStatuses = user.Transactions.reduce(
        (acc, transaction) => {
          const transactionStatus = transaction.TransactionStatuses.find(
            (transactionStatus) =>
              transactionStatus.statusCode === PaymentStatusCode.COMPLETE,
          );
          if (!transactionStatus) {
            return acc;
          }
          acc.push({
            ...transactionStatus,
            Transaction: transaction,
          });
          return acc;
        },
        [] as TransactionStatusWithTransaction[],
      );

      return {
        ...generateUserTotalBalancesFromTransactions(transactionStatuses),
        user: {
          ...user,
          Transactions: undefined,
        },
      };
    }),
  );
  return userTotalBalances;
};
