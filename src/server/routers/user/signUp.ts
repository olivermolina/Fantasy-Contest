import { t } from '~/server/trpc';
import { supabase } from '~/utils/supabaseClient';
import logger from '~/utils/logger';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { setAuthResponse } from './setAuthResponse';
import { autoJoinDefaultContest } from '~/server/routers/user/autoJoinDefaultContest';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const signUp = t.procedure
  .input(
    yup.object({
      email: yup.string().required(),
      username: yup.string().required(),
      state: yup.string().required(),
      phone: yup
        .string()
        .matches(
          /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
          'Invalid phone number.',
        )
        .required(),
      DOB: yup.date().required(),
      password: yup.string().required(),
      confirmPassword: yup.string().required(),
      referralCode: yup.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    let uid: string | undefined;
    try {
      const result = await supabase.auth.signUp(
        {
          email: input.email,
          password: input.password,
        },
        {
          data: {
            state: input.state,
            DOB: input.DOB,
            username: input.username,
          },
        },
      );
      const user = result.user;
      if (!user) {
        logger.error('There was an error signing up.', result.error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            result?.error?.status === 400
              ? CustomErrorMessages.SIGNUP_DUPLICATE_ERROR
              : CustomErrorMessages.SIGNUP_ERROR,
        });
      }
      const session = result.session;
      // This will return null if Supabase "email confirmations" are turned on!
      if (!session) {
        logger.error('There was an error getting user session.', result.error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No session.',
        });
      }
      uid = user.id;
      const phone = input.phone.match(/\d+/);
      if (!phone) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid phone number.',
        });
      }
      const numbers = phone[0];
      if (!numbers) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid phone number.',
        });
      }

      await prisma.user.upsert({
        where: {
          id: uid,
        },
        create: {
          id: uid,
          email: user.email!,
          state: input.state,
          phone: Number(numbers),
          DOB: input.DOB,
          username: input.username,
          referral: input.referralCode,
        },
        update: {
          email: user.email!,
          state: input.state,
          phone: Number(numbers),
          DOB: input.DOB,
          username: input.username,
          referral: input.referralCode,
        },
      });

      // Auto join more or less contest
      await autoJoinDefaultContest(uid);

      setAuthResponse(
        ctx,
        result.session?.access_token,
        result.session?.refresh_token,
      );
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.SIGNUP_ERROR,
      });
    }
  });

export default signUp;
