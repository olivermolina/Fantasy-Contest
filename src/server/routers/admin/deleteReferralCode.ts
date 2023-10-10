import * as yup from '~/utils/yup';
import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const deleteReferralCode = adminProcedure
  .input(
    yup.object({
      userId: yup.string().required(),
      referralCode: yup.string().required(),
    }),
  )
  .mutation(async ({ input }) => {
    const referralCode = await prisma.referralCode.findFirst({
      where: {
        code: input.referralCode,
        userId: input.userId,
      },
    });

    if (!referralCode) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.REFERRAL_CODE_NOT_FOUND,
      });
    }

    return await prisma.referralCode.delete({
      where: {
        id: referralCode.id,
      },
    });
  });

export default deleteReferralCode;
