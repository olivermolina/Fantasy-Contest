import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import { prisma } from '~/server/prisma';

const userDetails = t.procedure.query(async ({ ctx }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

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
  return user;
});

export default userDetails;
