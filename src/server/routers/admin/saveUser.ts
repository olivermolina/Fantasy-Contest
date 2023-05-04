import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import {
  UserFormInputs,
  UserFormValidationSchema,
} from '~/components/Pages/Admin/ManageUsers/UserForm';
import { supabase } from '~/utils/supabaseClient';
import logger from '~/utils/logger';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import prisma from '~/server/prisma';
import { NEW_USER_ID } from '~/constants/NewUserId';
import { UserStatus, UserType } from '@prisma/client';

/**
 * This module defines a function named `saveUser` that handles user creation and update.
 * It takes an `input` object as an argument and returns an updated prisma `User` object.
 * The input object is validated against a `UserFormValidationSchema`,
 * which should ensure that the input data is in the expected format and conforms to the validation rules.
 */
export const innerFn = async ({ input }: { input: UserFormInputs }) => {
  let prismaUser = null;

  // If the input user's ID is equal to a constant `NEW_USER_ID`,
  // attempt to sign up a new user using the `supabase.auth.signUp` method
  if (input.id === NEW_USER_ID) {
    try {
      const result = await supabase.auth.signUp(
        {
          email: input.email,
          password: input.password,
        },
        {
          data: {
            username: input.username,
            state: '',
            DOB: new Date(),
          },
        },
      );
      // If user signup was successful, create a new user record in the prisma database
      const user = result.user;
      if (!user) {
        logger.error('There was an error adding user.', result.error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            result?.error?.status === 400
              ? CustomErrorMessages.SIGNUP_DUPLICATE_ERROR
              : CustomErrorMessages.SIGNUP_ERROR,
        });
      }

      const uid = user.id;
      prismaUser = await prisma.user.create({
        data: {
          id: uid,
          email: input.email,
          state: '',
          phone: Number(input.phone),
          DOB: new Date(),
          username: input.username,
          referral: '',
          type: input.type,
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
  } else {
    // If the input user's ID is not equal to `NEW_USER_ID`, update the user's record in the `prisma` database using the `prisma.user.update` method
    prismaUser = await prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        status: input.status ? UserStatus.ACTIVE : UserStatus.INACTIVE,
        phone: Number(input.phone),
      },
    });
  }
  // If the input user type is AGENT, create or update an agent record in the prisma database
  if (input.type === UserType.AGENT) {
    await prisma.agent.upsert({
      where: {
        userId: prismaUser.id,
      },
      create: {
        userId: prismaUser.id,
        subAdminId: input.subAdminId,
      },
      update: {
        userId: prismaUser.id,
        subAdminId: input.subAdminId,
      },
    });
  }

  // Return the created or updated prisma user object
  return prismaUser;
};

const saveUser = adminProcedure
  .input(UserFormValidationSchema)
  .mutation(innerFn);

export default saveUser;
