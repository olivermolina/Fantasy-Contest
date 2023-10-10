import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { isAuthenticated } from '~/server/routers/middleware/isAuthenticated';

const userDetails = isAuthenticated.query(async ({ ctx }) => {
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
      message: CustomErrorMessages.USER_NOT_FOUND,
    });
  }
  return user;
});

export default userDetails;
