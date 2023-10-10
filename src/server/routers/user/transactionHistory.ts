import { prisma } from '~/server/prisma';
import { TransactionType } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import _ from 'lodash';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import z from 'zod';
import { isAuthenticated } from '~/server/routers/middleware/isAuthenticated';
import { USATimeZone } from '~/constants/USATimeZone';
import dayjs from 'dayjs';

export interface TransactionHistoryInterface {
  id: string;
  userId: string;
  username: string;
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
    case ActionType.REFERRAL_FREE_CREDIT:
      return 'Referral Bonus Credit';
    case ActionType.TOKEN_CONTEST_WIN:
    case ActionType.CASH_CONTEST_WIN:
      return 'Win';
    case ActionType.JOIN_CONTEST:
      return 'Join contest entry fee';
    default:
      return _.startCase(_.toLower(action.replaceAll('_', ' ')));
  }
};

const transactionHistory = isAuthenticated
  .input(
    z.object({
      userId: z.string().optional().nullable(),
      from: z.string(),
      to: z.string(),
      actionTypes: z.array(z.nativeEnum(ActionType)).optional().nullable(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const userId = input.userId || ctx.session.user?.id;
    const timezone = USATimeZone['America/New_York'];
    const startDate = dayjs.tz(input.from, timezone).toDate();
    const endDate = dayjs.tz(input.to, timezone).toDate();
    // Add 1 day to the end date to include all bets for the end date
    endDate.setDate(endDate.getDate() + 1);

    const transactionDates = {
      gte: startDate,
      lte: endDate,
    };

    const transactions = await prisma.transaction.findMany({
      where: {
        created_at: transactionDates,
        ...(input.actionTypes
          ? {
              actionType: {
                in: input.actionTypes,
              },
            }
          : {
              userId,
            }),
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
        User: true,
      },
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      userId: transaction.userId,
      username: transaction.User.username,
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
  });

export default transactionHistory;
