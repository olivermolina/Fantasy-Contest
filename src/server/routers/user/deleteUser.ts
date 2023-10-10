import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import { supabase as supabaseAdmin } from '~/utils/supabaseAdminClient';
import { supabase } from '~/utils/supabaseClient';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { isAuthenticated } from '~/server/routers/middleware/isAuthenticated';
import prisma from '~/server/prisma';

const deleteUser = isAuthenticated
  .input(
    yup.object({
      password: yup
        .string()
        .min(8, 'Your password must be at least 8 characters.')
        .required(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { data } = await supabase.auth.signInWithPassword({
      email: ctx.session!.user!.email!,
      password: input.password,
    });

    const userId = data.user?.id;

    if (!userId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.INVALID_PASSWORD,
      });
    }
    const deleteUserResult = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (!deleteUserResult.data.user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.DEFAULT,
      });
    }

    try {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return CustomErrorMessages.DELETE_ACCOUNT;
    } catch (e) {
      if (e instanceof TRPCError) throw e;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.DEFAULT,
      });
    }
  });

export default deleteUser;
