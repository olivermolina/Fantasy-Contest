import prisma from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import logger from '~/utils/logger';
import { TRPCError } from '@trpc/server';
import { PicksCategoryLimitFormValidationSchema } from '~/schemas/PicksCategoryLimitFormValidationSchema';

export const setContestCategoryLimits = adminProcedure
  .input(PicksCategoryLimitFormValidationSchema)
  .mutation(async ({ input }) => {
    try {
      const { picksCategoryLimits } = input;
      return await prisma.$transaction(
        picksCategoryLimits.map((picksCategory) =>
          prisma.contestCategory.update({
            where: {
              id: picksCategory.id,
            },
            data: {
              customStakeLimitEnabled: picksCategory.customStakeLimitEnabled,
              minStakeAmount: picksCategory.minStakeAmount,
              maxStakeAmount: picksCategory.maxStakeAmount,
              allInPayoutMultiplier: picksCategory.allInPayoutMultiplier,
              primaryInsuredPayoutMultiplier:
                picksCategory.primaryInsuredPayoutMultiplier,
              secondaryInsuredPayoutMultiplier:
                picksCategory.secondaryInsuredPayoutMultiplier,
            },
          }),
        ),
      );
    } catch (error) {
      logger.error('There was an error updating user limits', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  });
