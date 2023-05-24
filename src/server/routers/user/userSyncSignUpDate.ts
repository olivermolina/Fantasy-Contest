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
      const { data: users } = await supabase.auth.api.listUsers();
      if (users) {
        return await prisma.$transaction(
          users.map((user) =>
            prisma.user.upsert({
              where: {
                id: user.id,
              },
              create: {
                ...user.user_metadata,
                id: user.id,
                email: user.email!,
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
