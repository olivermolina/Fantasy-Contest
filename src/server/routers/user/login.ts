import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { supabase } from '~/utils/supabaseClient';
import { setAuthResponse } from './setAuthResponse';
import { autoJoinDefaultContest } from '~/server/routers/user/autoJoinDefaultContest';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { UserStatus } from '@prisma/client';

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
    const { data } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (!data.user || !data.session) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.INVALID_EMAIL_PASSWORD,
      });
    }

    try {
      //Check user if exists in prisma
      const userId = data.user.id;
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
            email: data.user.email!,
            ...data.user.user_metadata,
          },
          update: {
            email: data.user.email!,
            ...data.user.user_metadata,
          },
        });
      }

      // Auto join more or less contest
      await autoJoinDefaultContest(userId);

      if (prismaUser?.status === UserStatus.INACTIVE) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: CustomErrorMessages.ACCOUNT_INACTIVE,
        });
      }

      setAuthResponse(
        ctx,
        data.session?.access_token,
        data.session?.refresh_token,
      );
    } catch (e) {
      if (e instanceof TRPCError) throw e;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.LOGIN,
      });
    }
  });

export default login;
