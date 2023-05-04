import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import * as yup from '~/utils/yup';
import { getAgentByReferralCode } from '~/server/routers/user/getAgentByReferralCode';

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
        message: 'Referral user not found',
      });
    }
    return user;
  });

export default checkReferral;
