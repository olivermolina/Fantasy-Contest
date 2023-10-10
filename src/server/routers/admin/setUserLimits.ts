import { adminProcedure } from './middleware/isAdmin';
import prisma from '~/server/prisma';
import { AppSettingName, BetStakeType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { UserLimitInputs } from '~/schemas/UserLimitValidationSchema';
import z from 'zod';

/**
 * Sets the min and max bet amount for users globally across the app.
 */
export const setUserLimits = adminProcedure
  .input(
    z
      .object({
        userId: z.string().optional(),
        username: z.string().optional(),
        min: z.coerce.number().min(1),
        max: z.coerce.number(),
        repeatEntries: z.coerce.number(),
        maxDailyTotalBetAmount: z.coerce.number(),
        notes: z.string().optional(),
        bonusCreditLimits: z
          .array(
            z.object({
              contestCategoryId: z.string(),
              numberOfPicks: z.coerce.number(),
              id: z.string(),
              enabled: z.boolean(),
              bonusCreditFreeEntryEquivalent: z.coerce
                .number()
                .min(0, 'Bonus Credit Free Entry is required'),
              stakeTypeOptions: z.array(z.nativeEnum(BetStakeType)),
            }),
          )
          .optional(),
      })
      .refine((data) => data.max > data.min, {
        message: 'Maximum limit must be greater than minimum',
        path: ['max'],
      }),
  )
  .mutation(async ({ input }) => {
    try {
      let user;

      if (input.userId) {
        user = await prisma.user.findUnique({
          where: {
            id: input.userId,
          },
        });
      }

      if (input.username && !input.userId) {
        user = await prisma.user.findFirst({
          where: {
            username: input.username,
          },
        });
      }
      // If the userId is defined, then we are updating users settings.
      if (user) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            notes: input.notes,
          },
        });
        await updateUserSettings(input as UserLimitInputs);
      } else {
        // If the userId is undefined, then we are updating the global settings.
        await updateGlobalSettings(input);
      }
    } catch (error) {
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
  repeatEntries: number;
  maxDailyTotalBetAmount: number;
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
    prisma.appSettings.upsert({
      where: {
        name: AppSettingName.REPEAT_ENTRIES_LIMIT,
      },
      update: {
        value: input.repeatEntries.toString(),
      },
      create: {
        name: AppSettingName.REPEAT_ENTRIES_LIMIT,
        value: input.repeatEntries.toString(),
      },
    }),
    prisma.appSettings.upsert({
      where: {
        name: AppSettingName.MAX_DAILY_TOTAL_BET_AMOUNT,
      },
      update: {
        value: input.maxDailyTotalBetAmount.toString(),
      },
      create: {
        name: AppSettingName.MAX_DAILY_TOTAL_BET_AMOUNT,
        value: input.maxDailyTotalBetAmount.toString(),
      },
    }),
  ]);
}

/**
 * This function is used to update the min and max bet amount for a specific user.
 */
async function updateUserSettings(input: UserLimitInputs) {
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
    prisma.userAppSettings.upsert({
      where: {
        userId_name: {
          userId: input.userId,
          name: AppSettingName.REPEAT_ENTRIES_LIMIT,
        },
      },
      update: {
        value: input.repeatEntries.toString(),
      },
      create: {
        userId: input.userId,
        name: AppSettingName.REPEAT_ENTRIES_LIMIT,
        value: input.repeatEntries.toString(),
      },
    }),
    prisma.userAppSettings.upsert({
      where: {
        userId_name: {
          userId: input.userId,
          name: AppSettingName.MAX_DAILY_TOTAL_BET_AMOUNT,
        },
      },
      update: {
        value: input.maxDailyTotalBetAmount.toString(),
      },
      create: {
        userId: input.userId,
        name: AppSettingName.MAX_DAILY_TOTAL_BET_AMOUNT,
        value: input.maxDailyTotalBetAmount.toString(),
      },
    }),
    ...(Array.isArray(input.bonusCreditLimits)
      ? input.bonusCreditLimits?.map((bonusCreditLimit) =>
          prisma.userBonusCreditLimit.upsert({
            where: {
              id: bonusCreditLimit.id,
            },
            update: {
              enabled: bonusCreditLimit.enabled,
              bonusCreditFreeEntryEquivalent:
                bonusCreditLimit.bonusCreditFreeEntryEquivalent,
              stakeTypeOptions: bonusCreditLimit.stakeTypeOptions,
            },
            create: {
              userId: input.userId,
              enabled: bonusCreditLimit.enabled,
              bonusCreditFreeEntryEquivalent:
                bonusCreditLimit.bonusCreditFreeEntryEquivalent,
              stakeTypeOptions: bonusCreditLimit.stakeTypeOptions,
              bonusCreditLimitId: bonusCreditLimit.id,
            },
          }),
        )
      : []),
  ]);
}
