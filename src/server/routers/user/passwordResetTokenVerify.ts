import { t } from '~/server/trpc';
import * as yup from '~/utils/yup';
import { supabase } from '~/utils/supabaseClient';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const passwordResetTokenVerify = t.procedure
  .input(
    yup.object({
      accessTokenJwt: yup.string().required(),
    }),
  )
  .mutation(async ({ input }) => {
    const { error } = await supabase.auth.getUser(input.accessTokenJwt);

    if (error)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.PASSWORD_RESET_EXPIRED,
      });

    return 'Verify password reset token Success!';
  });

export default passwordResetTokenVerify;
