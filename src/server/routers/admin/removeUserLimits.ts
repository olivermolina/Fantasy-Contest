import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';
import z from 'zod';
import { AppSettingName } from '@prisma/client';

/**
 * This function is used to remove user limits for a user.
 */
const removeUserLimits = adminProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(({ input: { userId } }) => {
    return prisma.$transaction([
      prisma.userAppSettings.deleteMany({
        where: {
          userId,
          name: {
            in: [
              AppSettingName.MAX_BET_AMOUNT,
              AppSettingName.MIN_BET_AMOUNT,
              AppSettingName.REPEAT_ENTRIES_LIMIT,
              AppSettingName.MAX_DAILY_TOTAL_BET_AMOUNT,
              AppSettingName.NUMBER_OF_PLAYERS_FREE_ENTRY,
              AppSettingName.STAKE_TYPE_FREE_ENTRY,
              AppSettingName.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT,
            ],
          },
        },
      }),
      prisma.userBonusCreditLimit.deleteMany({
        where: {
          userId,
        },
      }),
    ]);
  });

export default removeUserLimits;
