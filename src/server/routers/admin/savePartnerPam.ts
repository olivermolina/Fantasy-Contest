import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import { EditFormInputs } from '~/components/Pages/Admin/ManagePartnersPams/EditForm';
import { supabase } from '~/utils/supabaseClient';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import prisma from '~/server/prisma';
import { NEW_USER_ID } from '~/constants/NewUserId';
import { User, UserStatus, UserType } from '@prisma/client';
import { EditFormValidationSchema } from '~/schemas/EditFormValidationSchema';

/**
 * This module defines a function named `savePartner` that handles Partner/PAM creation and update.
 * It takes an `input` object as an argument and returns an updated prisma `User` object.
 * The input object is validated against a `EditFormValidationSchema`,
 * which should ensure that the input data is in the expected format and conforms to the validation rules.
 */
export const innerFn = async ({ input }: { input: EditFormInputs }) => {
  let prismaUser: User | null = null;

  // If the input user's ID is equal to a constant `NEW_USER_ID`,
  // attempt to sign up a new user using the `supabase.auth.signUp` method
  if (input.id === NEW_USER_ID) {
    try {
      const result = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            username: input.username,
            state: '',
            DOB: new Date(),
          },
        },
      });
      // If user signup was successful, create a new user record in the prisma database
      const user = result.data.user;
      if (!user) {
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
        type: input.type,
      },
    });
  }
  // If the input user type is AGENT, create or update an agent record in the prisma database
  if (input.type === UserType.AGENT) {
    const subAdminId = null;

    const agent = await prisma.agent.upsert({
      where: {
        userId: prismaUser.id,
      },
      create: {
        userId: prismaUser.id,
        subAdminId,
      },
      update: {
        userId: prismaUser.id,
        subAdminId,
      },
    });

    // Delete all existing agent sub-admin records for the agent
    await prisma.agentSubAdmin.deleteMany({
      where: {
        agentId: agent.id,
      },
    });

    if (agent && Array.isArray(input.subAdminIds)) {
      // Populate agent sub-admin records for the agent
      await prisma.$transaction(
        input.subAdminIds.map((subAdminId) =>
          prisma.agentSubAdmin.upsert({
            where: {
              agentId_subAdminId: {
                agentId: agent.id,
                subAdminId,
              },
            },
            create: {
              agentId: agent.id,
              subAdminId,
            },
            update: {},
          }),
        ),
      );
    }
  }

  // Return the created or updated prisma user object
  return prismaUser;
};

const savePartnerPam = adminProcedure
  .input(EditFormValidationSchema)
  .mutation(innerFn);

export default savePartnerPam;
