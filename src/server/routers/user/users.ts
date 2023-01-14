import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import { prisma } from '~/server/prisma';

const users = t.procedure.query(async ({ ctx }) => {
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

  if (!user.isAdmin) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `You don't have permission to access the user list`,
    });
  }

  return await prisma.user.findMany({
    where: {
      NOT: { id: userId },
    },
    select: {
      id: true,
      email: true,
      username: true,
      referral: true,
    },
  });
});

export default users;
