import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import { prisma } from '~/server/prisma';
import { TransactionType } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import * as yup from '~/utils/yup';
import _ from 'lodash';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';

export interface TransactionHistoryInterface {
  id: string;
  transactionDate: Date | string;
  type: TransactionType | string;
  details: string;
  amount: number;
  amountBonus: number;
  status: string;
}

const mapActionTypeToDescription = (action: ActionType) => {
  switch (action) {
    case ActionType.PLACE_BET:
      return 'Place entry';
    case ActionType.PAYOUT:
      return 'Payout';
    case ActionType.PAY:
      return 'Deposit';
    case ActionType.ADD_FREE_CREDIT:
      return 'Free credit';
    case ActionType.TOKEN_CONTEST_WIN:
    case ActionType.CASH_CONTEST_WIN:
      return 'Win';
    case ActionType.JOIN_CONTEST:
      return 'Join contest entry fee';
    default:
      return _.startCase(_.toLower(action.replaceAll('_', ' ')));
  }
};

const transactionHistory = t.procedure
  .input(
    yup.object({
      limit: yup.number().required(),
      cursor: yup.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    const userId = ctx.session.user?.id;
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

    const limit = input.limit ?? 50;
    const { cursor } = input;

    const totalRowCount = await prisma.transaction.count({
      where: {
        userId,
        NOT: {
          TransactionStatuses: {
            none: {},
          },
        },
      },
    });

    const transactions = await prisma.transaction.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        userId,
        NOT: {
          TransactionStatuses: {
            none: {},
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        TransactionStatuses: true,
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (transactions.length > limit) {
      const nextItem = transactions.pop();
      nextCursor = nextItem?.id;
    }

    const transactionData = transactions.map((transaction) => ({
      id: transaction.id,
      transactionDate: transaction.created_at,
      type: transaction.TransactionStatuses[0]?.transactionType,
      details: mapActionTypeToDescription(transaction.actionType as ActionType),
      amount: Number(transaction.amountProcess),
      amountBonus: Number(transaction.amountBonus),
      status:
        Object.keys(PaymentStatusCode)[
          Object.values(PaymentStatusCode).indexOf(
            transaction.TransactionStatuses[0]?.statusCode as number,
          )
        ],
    })) as TransactionHistoryInterface[];

    return {
      transactions: transactionData,
      nextCursor,
      meta: {
        totalRowCount,
      },
    };
  });

export default transactionHistory;
