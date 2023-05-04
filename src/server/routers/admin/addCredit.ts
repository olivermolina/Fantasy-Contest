import * as yup from '~/utils/yup';
import { TransactionType } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';

const addCredit = adminProcedure
  .input(
    yup.object({
      userId: yup.string().required(),
      creditAmount: yup.number().required(),
    }),
  )
  .mutation(async ({ input }) => {
    await createTransaction({
      userId: input.userId,
      amountProcess: 0,
      amountBonus: Math.abs(input.creditAmount),
      actionType: ActionType.ADD_FREE_CREDIT,
      transactionType:
        Math.sign(input.creditAmount) === -1
          ? TransactionType.DEBIT
          : TransactionType.CREDIT,
    });

    return input;
  });

export default addCredit;
