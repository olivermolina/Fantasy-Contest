import { t } from '~/server/trpc';
import * as yup from '~/utils/yup';
import { supabase } from '~/utils/supabaseClient';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const passwordReset = t.procedure
  .input(
    yup.object({
      email: yup.string().required(),
    }),
  )
  .mutation(async ({ input }) => {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://www.lockspread.com'
        : 'http://localhost:3000';
    const redirectTo = `${baseUrl}/auth/update-password`;
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(
      input.email,
      {
        redirectTo,
      },
    );
    if (data) return 'Password reset link email sent successfully!';
    if (error)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.PASSWORD_RESET,
      });
  });

export default passwordReset;
