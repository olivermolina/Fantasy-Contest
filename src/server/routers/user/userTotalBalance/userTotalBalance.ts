import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import getUserTotalBalance from './getUserTotalBalance';

import { prisma } from '~/server/prisma';
import { z } from 'zod';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const userTotalBalance = t.procedure
  .input(
    z
      .object({
        userId: z.string().optional(),
      })
      .optional(),
  )
  .query(async ({ ctx, input }) => {
    const contextUserId = ctx.session.user?.id;

    if (!contextUserId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.USER_NOT_FOUND,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: contextUserId,
      },
    });

    const userId =
      user?.isAdmin && input?.userId ? input.userId : contextUserId;

    return getUserTotalBalance(userId);
  });

export default userTotalBalance;
