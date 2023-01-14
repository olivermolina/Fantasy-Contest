import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import getUserTotalBalance from './getUserTotalBalance';

const userTotalBalance = t.procedure.query(async ({ ctx }) => {
  const userId = ctx.session.user?.id;
  if (!userId) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Invalid user id!',
    });
  }

  return getUserTotalBalance(userId);
});

export default userTotalBalance;
