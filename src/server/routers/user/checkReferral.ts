import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import { getAgentByReferralCode } from '~/server/routers/user/getAgentByReferralCode';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { t } from '~/server/trpc';

const checkReferral = t.procedure
  .input(
    yup.object({
      referralCode: yup.string().required(),
    }),
  )
  .mutation(async ({ input }) => {
    const agent = await getAgentByReferralCode(input.referralCode);
    const user = agent?.User;
    if (!user) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.REFERRAL_USER_NOT_FOUND,
      });
    }
    return user;
  });

export default checkReferral;
