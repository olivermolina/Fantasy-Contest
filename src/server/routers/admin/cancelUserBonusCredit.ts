import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';

/**
 * This mutation will cancel the user bonus credits by transaction ID
 * @params transactionId {string}- The transaction id
 */
const cancelUserBonusCredits = adminProcedure
  .input(
    yup.object({
      transactionId: yup.string().required(),
    }),
  )
  .mutation(async ({ input }) => {
    return await prisma.transactionStatus.updateMany({
      where: {
        transactionId: input.transactionId,
      },
      data: {
        statusCode: PaymentStatusCode.CANCELLED,
      },
    });
  });

export default cancelUserBonusCredits;
