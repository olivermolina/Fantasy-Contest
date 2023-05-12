import {
  adminProcedure,
  UpdatedContext,
} from '~/server/routers/admin/middleware/isAdmin';
import {
  UserFormInputs,
  UserFormValidationSchema,
} from '~/components/Pages/Admin/ManageUsers/UserForm';
import { supabase } from '~/utils/supabaseClient';
import logger from '~/utils/logger';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import prisma from '~/server/prisma';
import { UserStatus, UserType } from '@prisma/client';
import { NEW_USER_ID } from '~/constants/NewUserId';

/**
 * This module defines a function named `savePartner` that handles Partner/PAM creation and update.
 * It takes an `input` object as an argument and returns an updated prisma `User` object.
 * The input object is validated against a `EditFormValidationSchema`,
 * which should ensure that the input data is in the expected format and conforms to the validation rules.
 */
export const innerFn = async ({
  input,
  ctx,
}: {
  input: UserFormInputs;
  ctx: UpdatedContext;
}) => {
  let prismaUser = null;
  const { password, ...restInput } = input;
  let uid = input.id;

  try {
    // If the input user's ID is equal to a constant `NEW_USER_ID`,
    // attempt to sign up a new user using the `supabase.auth.signUp` method
    if (input.id === NEW_USER_ID) {
      const result = await supabase.auth.signUp(
        {
          email: input.email,
          password: password,
        },
        {
          data: {
            username: input.username,
            state: '',
            DOB: new Date(),
          },
        },
      );

      const user = result.user;
      if (!user) {
        // If there was an error during signup, throw a TRPCError with a signup error message
        logger.error('There was an error adding user.', result.error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            result?.error?.status === 400
              ? CustomErrorMessages.SIGNUP_DUPLICATE_ERROR
              : CustomErrorMessages.SIGNUP_ERROR,
        });
      }
      uid = user.id;
    }

    // Create or update a user record in the prisma database
    const status = input.status ? UserStatus.ACTIVE : UserStatus.INACTIVE;
    const phone = Number(input.phone);
    const DOB = new Date(input.DOB);
    prismaUser = await prisma.user.upsert({
      where: {
        id: uid,
      },
      create: {
        ...restInput,
        id: uid,
        type: UserType.PLAYER,
        status,
        phone,
        DOB,
        agentId:
          ctx.user.type === UserType.AGENT
            ? ctx.user.UserAsAgents[0]?.id
            : null,
        referral: ctx.user.type === UserType.AGENT ? ctx.user.username : '',
      },
      update: {
        ...restInput,
        status,
        phone,
        DOB,
      },
    });
  } catch (error) {
    // If there was an error during signup or user creation, throw a TRPCError with a custom error message
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: CustomErrorMessages.DEFAULT,
    });
  }

  // Return the created or updated prisma user object
  return prismaUser;
};

const saveUser = adminProcedure
  .input(UserFormValidationSchema)
  .mutation(innerFn);

export default saveUser;
