import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import prisma from '~/server/prisma';
import { TransactionType } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import { createTransaction } from '~/server/routers/bets/createTransaction';

const addRemoveWithdrawable = t.procedure
  .input(
    yup.object({
      userId: yup.string().required(),
      amount: yup.number().required(),
      transactionType: yup.mixed<TransactionType>().required(),
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
        message: `You don't have permission to add/remove amount available to withdraw.`,
      });
    }

    await createTransaction({
      userId: input.userId,
      amountProcess: input.amount,
      amountBonus: 0,
      actionType:
        input.transactionType === TransactionType.CREDIT
          ? ActionType.ADD_WITHDRAWABLE
          : ActionType.REMOVE_WITHDRAWABLE,
      transactionType: input.transactionType,
    });

    return input;
  });

export default addRemoveWithdrawable;
