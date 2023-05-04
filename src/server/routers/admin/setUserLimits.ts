import { adminProcedure } from './middleware/isAdmin';
import { z } from 'zod';
import prisma from '~/server/prisma';
import { AppSettingName } from '@prisma/client';
import logger from '~/utils/logger';
import { TRPCError } from '@trpc/server';

/**
 * Sets the min and max bet amount for users globally across the app.
 */
export const setUserLimits = adminProcedure
  .input(
    z
      .object({
        min: z.number().min(1),
        max: z.number(),
        userId: z.string().optional(),
        username: z.string().optional(),
      })
      .refine((data) => data.max > data.min, {
        message: 'Maximum limit must be greater than minimum',
        path: ['max'],
      }),
  )
  .mutation(async ({ input }) => {
    try {
      let { userId } = input;
      if (input.username && !userId) {
        userId = (
          await prisma.user.findFirst({
            where: {
              username: input.username,
            },
          })
        )?.id;
      }
      // If the userId is defined, then we are updating users settings.
      if (userId !== undefined) {
        await updateUserSettings({ ...input, userId });
      } else {
        // If the userId is undefined, then we are updating the global settings.
        await updateGlobalSettings(input);
      }
    } catch (error) {
      logger.error('There was an error updating user limits', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  });

/**
 * This function is used to update the min and max bet amount for all users.
 */
async function updateGlobalSettings(input: {
  userId?: string | undefined;
  min: number;
  max: number;
}) {
  await prisma.$transaction([
    prisma.appSettings.upsert({
      where: {
        name: AppSettingName.MIN_BET_AMOUNT,
      },
      update: {
        value: input.min.toString(),
      },
      create: {
        name: AppSettingName.MIN_BET_AMOUNT,
        value: input.min.toString(),
      },
    }),
    prisma.appSettings.upsert({
      where: {
        name: AppSettingName.MAX_BET_AMOUNT,
      },
      update: {
        value: input.max.toString(),
      },
      create: {
        name: AppSettingName.MAX_BET_AMOUNT,
        value: input.max.toString(),
      },
    }),
  ]);
}

/**
 * This function is used to update the min and max bet amount for a specific user.
 */
async function updateUserSettings(input: {
  userId: string;
  min: number;
  max: number;
}) {
  await prisma.$transaction([
    prisma.userAppSettings.upsert({
      where: {
        userId_name: {
          userId: input.userId,
          name: AppSettingName.MIN_BET_AMOUNT,
        },
      },
      update: {
        value: input.min.toString(),
      },
      create: {
        userId: input.userId,
        name: AppSettingName.MIN_BET_AMOUNT,
        value: input.min.toString(),
      },
    }),
    prisma.userAppSettings.upsert({
      where: {
        userId_name: {
          userId: input.userId,
          name: AppSettingName.MAX_BET_AMOUNT,
        },
      },
      update: {
        value: input.max.toString(),
      },
      create: {
        userId: input.userId,
        name: AppSettingName.MAX_BET_AMOUNT,
        value: input.max.toString(),
      },
    }),
  ]);
}
