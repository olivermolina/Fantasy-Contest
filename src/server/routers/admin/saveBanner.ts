import {
  adminProcedure,
  UpdatedContext,
} from '~/server/routers/admin/middleware/isAdmin';
import { supabase } from '~/utils/supabaseClient';
import logger from '~/utils/logger';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import prisma from '~/server/prisma';
import { UserType } from '@prisma/client';
import { NEW_USER_ID } from '~/constants/NewUserId';
import { BannerFormValidationSchema } from '~/schemas/BannerFormValidationSchema';
import { BannerFormInputs } from '~/components/Pages/Admin/ManageContent/BannerForm';

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
  input: BannerFormInputs;
  ctx: UpdatedContext;
}) => {
  let prismaBanner = null;

  const { ...restInput } = input;

  try {
    // If the input user's ID is equal to a constant `NEW_USER_ID`,
    // attempt to sign up a new user using the `supabase.auth.signUp` method
    const id = String(input.id);
    prismaBanner = await prisma.banner.upsert({
      where: {
        id: id,
      },
      create: {
        ...restInput,
        id: id,
      },
      update: {
        ...restInput,
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
  return prismaBanner;
};

const saveBanner = adminProcedure
  .input(BannerFormValidationSchema)
  .mutation(innerFn);

export default saveBanner;
