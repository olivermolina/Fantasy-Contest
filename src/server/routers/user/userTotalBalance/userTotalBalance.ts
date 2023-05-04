import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import getUserTotalBalance from './getUserTotalBalance';
import * as yup from '~/utils/yup';

import { prisma } from '~/server/prisma';

const userTotalBalance = t.procedure
  .input(
    yup.object({
      userId: yup.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const contextUserId = ctx.session.user?.id;

    if (!contextUserId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Invalid user id!',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: contextUserId,
      },
    });

    const userId = user?.isAdmin && input.userId ? input.userId : contextUserId;

    return getUserTotalBalance(userId);
  });

export default userTotalBalance;
