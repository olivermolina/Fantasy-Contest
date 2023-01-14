import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { TransactionType } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import { createTransaction } from '~/server/routers/bets/createTransaction';

const addCredit = t.procedure
  .input(
    yup.object({
      userId: yup.string().required(),
      creditAmount: yup.number().required(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
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

    if (!user.isAdmin) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `You don't have permission to add user credits.`,
      });
    }

    await createTransaction({
      userId: input.userId,
      amountProcess: 0,
      amountBonus: input.creditAmount,
      actionType: ActionType.ADD_FREE_CREDIT,
      transactionType: TransactionType.CREDIT,
    });

    return input;
  });

export default addCredit;
