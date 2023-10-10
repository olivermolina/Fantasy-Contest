import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const contestCategoryList = t.procedure.query(async ({ ctx }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  const userId = ctx.session?.user?.id;
  if (!userId) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: CustomErrorMessages.USER_NOT_FOUND,
    });
  }

  return await prisma.contestCategory.findMany({
    include: {
      bonusCreditLimit: true,
    },
  });
});

export default contestCategoryList;
