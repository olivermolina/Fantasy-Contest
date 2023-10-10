import { t } from '~/server/trpc';
import { supabase } from '~/utils/supabaseClient';
import * as yup from '~/utils/yup';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const passwordUpdate = t.procedure
  .input(
    yup.object({
      refreshToken: yup.string().required(),
      password: yup.string().required(),
    }),
  )
  .mutation(async ({ input }) => {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: input.refreshToken,
    });

    if (!data.user || error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.PASSWORD_UPDATE_LINK,
      });
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: input.password,
    });

    if (updateError) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.PASSWORD_UPDATE_LINK,
      });
    }

    return 'Password successfully changed!';
  });

export default passwordUpdate;
