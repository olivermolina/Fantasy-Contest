import * as yup from '~/utils/yup';
import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';
import { TRPCError } from '@trpc/server';

const addReferralCode = adminProcedure
  .input(
    yup.object({
      userId: yup.string().required(),
      referralCode: yup.string().required(),
    }),
  )
  .mutation(async ({ input }) => {
    const [agent, referralCode] = await prisma.$transaction([
      prisma.agent.findFirst({
        where: { userId: input.userId },
      }),
      prisma.referralCode.findFirst({
        where: {
          code: input.referralCode,
        },
      }),
    ]);

    if (!agent) {
      // Create user as agent if not exist
      await prisma.agent.create({
        data: { userId: input.userId },
      });
    }

    if (referralCode) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Referral Code is already in use. Please try another code.',
      });
    }

    return await prisma.referralCode.create({
      data: {
        userId: input.userId,
        code: input.referralCode,
      },
    });
  });

export default addReferralCode;
