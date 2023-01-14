import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';

const checkReferral = t.procedure
  .input(
    yup.object({
      referralCode: yup.string().required(),
    }),
  )
  .mutation(async ({ input }) => {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        username: true,
        referral: true,
      },
      where: {
        username: input.referralCode,
      },
    });
    if (!user) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Referral user not found',
      });
    }
    return user;
  });

export default checkReferral;
