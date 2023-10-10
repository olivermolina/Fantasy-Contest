import { t } from '../../trpc';
import * as yup from '~/utils/yup';
import { TRPCError } from '@trpc/server';
import { TOKEN } from '~/constants/TOKEN';
import { supabase } from '~/utils/supabaseAdminClient';
import { prisma } from '~/server/prisma';

/**
 * Sync user sign up date from auth.user table to public.user table
 */
export const userSyncSignUpDate = t.procedure
  .input(
    yup
      .mixed<{
        token: string;
      }>()
      .required(),
  )
  .query(async ({ input }) => {
    if (input.token !== TOKEN) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    try {
      const { data } = await supabase.auth.admin.listUsers({
        perPage: 1000,
      });
      if (data?.users?.length > 0) {
        return await prisma.$transaction(
          data?.users.map((user) =>
            prisma.user.upsert({
              where: {
                id: user.id,
              },
              create: {
                ...user.user_metadata,
                id: user.id,
                email: user.email!,
                username: null,
              },
              update: {
                created_at: new Date(user.created_at),
              },
            }),
          ),
        );
      }
      return [];
    } catch (error) {
      throw error;
    }
  });

export default userSyncSignUpDate;
