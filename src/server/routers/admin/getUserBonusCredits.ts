import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';

/**
 * This query will get the list of user bonus credits
 * @params userId {string} - User unique ID
 */
const getUserBonusCredits = adminProcedure
  .input(
    yup.object({
      userId: yup.string().required(),
    }),
  )
  .query(async ({ input }) => {
    const bonusCreditTransactions = await prisma.transaction.findMany({
      where: {
        userId: input.userId,
        NOT: {
          TransactionStatuses: {
            none: {},
          },
        },
        TransactionStatuses: {
          every: {
            statusCode: {
              in: [PaymentStatusCode.COMPLETE, PaymentStatusCode.CANCELLED],
            },
          },
        },
        amountBonus: {
          gt: 0,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        TransactionStatuses: true,
      },
    });

    return bonusCreditTransactions.map((transaction) => ({
      id: transaction.id,
      transactionDate: transaction.created_at,
      type: transaction.TransactionStatuses[0]?.transactionType,
      amountBonus: Number(transaction.amountBonus),
      status: transaction.TransactionStatuses[0]?.statusCode,
    }));
  });

export default getUserBonusCredits;
