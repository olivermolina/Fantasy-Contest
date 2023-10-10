import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import z from 'zod';
import { ActionType } from '~/constants/ActionType';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import dayjs from 'dayjs';
import {
  CUSTOMER_IDENTITY_FEE,
  CUSTOMER_MONITOR_FEE,
  TRANSACTION_PROCESSING_FEE,
} from '~/constants/TsevoFees';

/**
 *  Zod Schema for the TSEVOBillingReport
 */
const TSEVOBillingSchema = z.object({
  sessionId: z.string(),
  createdAt: z.date(),
  userId: z.string(),
  username: z.string().nullable(),
  type: z.nativeEnum(ActionType),
  amount: z.number(),
  fee: z.number(),
  processingFee: z.number(),
});

/*
 *  Type for the TSEVOBillingReport
 */
export type TSEVOBillingType = z.infer<typeof TSEVOBillingSchema>;

/**
 * TSEVOBillingReport for billing & audit purposes
 */
const tsevoBillingReport = adminProcedure
  .input(
    z.object({
      from: z.date(),
      to: z.date(),
    }),
  )
  .output(z.array(TSEVOBillingSchema))
  .query(async ({ input }) => {
    const startDate = dayjs.tz(input.from, 'America/New_York').toDate();
    const endDate = dayjs.tz(input.to, 'America/New_York').toDate();
    // Add 1 day to the end date to include all for the end date
    endDate.setDate(endDate.getDate() + 1);

    const dateRangeInput = {
      gte: startDate,
      lte: endDate,
    };

    const [completedTransactions, customerMonitorAndProfileSessions] =
      await prisma.$transaction([
        prisma.transaction.findMany({
          where: {
            actionType: {
              in: [ActionType.PAY, ActionType.PAYOUT],
            },
            created_at: dateRangeInput,
            TransactionStatuses: {
              every: {
                statusCode: {
                  in: [PaymentStatusCode.COMPLETE],
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
            User: true,
          },
        }),
        prisma.session.findMany({
          where: {
            created_at: dateRangeInput,
            serviceType: {
              in: [
                ActionType.CUSTOMER_MONITOR,
                ActionType.GET_CUSTOMER_PROFILE,
              ],
            },
            NOT: {
              SessionResponses: {
                none: {},
              },
            },
          },
          include: {
            User: true,
          },
        }),
      ]);

    // Deposit/Payout transactions (completed)
    const formattedCompletedTransactions = completedTransactions.map(
      (transaction) =>
        ({
          sessionId: transaction.sessionId,
          createdAt: transaction.created_at,
          userId: transaction.userId,
          username: transaction.User.username,
          type: transaction.actionType,
          amount: Number(transaction.amountProcess),
          fee: TRANSACTION_PROCESSING_FEE,
          processingFee:
            Number(transaction.amountProcess) * TRANSACTION_PROCESSING_FEE,
        } as TSEVOBillingType),
    );

    // Customer monitor and profile sessions
    const formattedCustomerMonitorSessions =
      customerMonitorAndProfileSessions.map(
        (session) =>
          ({
            sessionId: session.id,
            createdAt: session.created_at,
            userId: session.userId,
            username: session.User.username,
            type: session.serviceType,
            amount: 1,
            fee:
              session.serviceType === ActionType.CUSTOMER_MONITOR
                ? CUSTOMER_MONITOR_FEE
                : CUSTOMER_IDENTITY_FEE,
            processingFee:
              session.serviceType === ActionType.CUSTOMER_MONITOR
                ? CUSTOMER_MONITOR_FEE
                : CUSTOMER_IDENTITY_FEE,
          } as TSEVOBillingType),
      );

    return [
      ...formattedCompletedTransactions,
      ...formattedCustomerMonitorSessions,
    ];
  });

export default tsevoBillingReport;
