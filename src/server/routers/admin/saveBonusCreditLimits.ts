import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';
import z from 'zod';
import { BetStakeType } from '@prisma/client';

/**
 * This function is used to save bonus credit limits for a contest category.
 */
const saveBonusCreditLimits = adminProcedure
  .input(
    z.array(
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
    ),
  )
  .mutation(async ({ input }) => {
    return await prisma.$transaction(
      input.map((bonusCreditLimit) =>
        prisma.bonusCreditLimit.upsert({
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
            enabled: bonusCreditLimit.enabled,
            bonusCreditFreeEntryEquivalent:
              bonusCreditLimit.bonusCreditFreeEntryEquivalent,
            stakeTypeOptions: bonusCreditLimit.stakeTypeOptions,
            contestCategory: {
              connect: {
                id: bonusCreditLimit.contestCategoryId,
              },
            },
          },
        }),
      ),
    );
  });

export default saveBonusCreditLimits;
