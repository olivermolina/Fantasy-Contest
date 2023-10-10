import {
  adminProcedure,
  UpdatedContext,
} from '~/server/routers/admin/middleware/isAdmin';
import { UserFormInputs } from '~/components/Pages/Admin/ManageUsers/UserForm';
import { supabase } from '~/utils/supabaseClient';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import prisma from '~/server/prisma';
import { UserType } from '@prisma/client';
import { NEW_USER_ID } from '~/constants/NewUserId';
import { UserFormValidationSchema } from '~/schemas/UserFormValidationSchema';

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
      const result = await supabase.auth.signUp({
        email: input.email,
        password: password,
        options: {
          data: {
            username: input.username,
            state: '',
            DOB: new Date(),
          },
        },
      });

      const user = result.data.user;
      if (!user) {
        // If there was an error during signup, throw a TRPCError with a signup error message
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
    const phone = Number(input.phone);
    const DOB = new Date(input.DOB);

    const oldUser = await prisma.user.findUnique({
      where: {
        id: uid,
      },
    });

    let referral = oldUser?.referral;
    let agentId = input.agentId;
    if (input.type === UserType.AGENT) {
      await prisma.agent.upsert({
        where: {
          userId: uid,
        },
        create: {
          userId: uid,
        },
        update: {},
      });
    } else {
      await prisma.agent.delete({
        where: {
          userId: uid,
        },
      });
    }

    if (ctx.user.type === UserType.AGENT) {
      const agent = await prisma.agent.findUnique({
        where: {
          userId: ctx.user.id,
        },
        include: {
          User: true,
        },
      });
      referral = ctx.user.username;
      agentId = agent?.id;
    } else if ((!oldUser?.referral || oldUser.agentId !== agentId) && agentId) {
      const agent = await prisma.agent.findUnique({
        where: {
          id: agentId,
        },
        include: {
          User: true,
        },
      });
      referral = agent?.User?.username;
    }

    prismaUser = await prisma.user.upsert({
      where: {
        id: uid,
      },
      create: {
        ...restInput,
        id: uid,
        phone,
        DOB,
        agentId,
        referral,
      },
      update: {
        ...restInput,
        agentId,
        referral,
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
