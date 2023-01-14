import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { supabase } from '~/utils/supabaseClient';
import { setAuthResponse } from './setAuthResponse';
import { autoJoinDefaultContest } from '~/server/routers/user/autoJoinDefaultContest';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const login = t.procedure
  .input(
    yup.object({
      email: yup.string().required(),
      password: yup
        .string()
        .min(8, 'Your password must be at least 8 characters.')
        .required(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const result = await supabase.auth.signIn({
      email: input.email,
      password: input.password,
    });

    if (!result.user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid email or password!',
      });
    }

    try {
      //Check user if exists in prisma
      const userId = result.user.id;
      const prismaUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!prismaUser) {
        //Register missing prisma user
        await prisma.user.upsert({
          where: {
            id: userId,
          },
          create: {
            id: userId,
            email: result.user.email!,
            ...result.user.user_metadata,
          },
          update: {
            email: result.user.email!,
            ...result.user.user_metadata,
          },
        });
      }

      // Auto join more or less contest
      await autoJoinDefaultContest(userId);

      setAuthResponse(
        ctx,
        result.session?.access_token,
        result.session?.refresh_token,
      );
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.LOGIN,
      });
    }
  });

export default login;
