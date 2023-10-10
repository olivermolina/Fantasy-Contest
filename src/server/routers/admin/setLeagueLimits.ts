import prisma from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import logger from '~/utils/logger';
import { TRPCError } from '@trpc/server';
import { LeagueLimitFormValidationSchema } from '~/schemas/LeagueLimitFormValidationSchema';

export const setLeagueLimits = adminProcedure
  .input(LeagueLimitFormValidationSchema)
  .mutation(async ({ input }) => {
    try {
      return await prisma.$transaction(
        async (trx) => {
          const {
            league,
            contestCategoryLeagueLimits,
            ...otherLeagueLimitFields
          } = input;
          const leagueLimit = await trx.leagueLimit.upsert({
            where: {
              league,
            },
            create: { ...otherLeagueLimitFields, league },
            update: otherLeagueLimitFields,
          });

          await Promise.all(
            contestCategoryLeagueLimits.map(
              async (contestCategoryLeagueLimit) => {
                const { contestCategoryId, numberOfPicks, ...otherFields } =
                  contestCategoryLeagueLimit;
                return await trx.contestCategoryLeagueLimit.upsert({
                  where: {
                    contestCategoryId_leagueLimitId: {
                      leagueLimitId: leagueLimit.id,
                      contestCategoryId,
                    },
                  },
                  create: {
                    ...otherFields,
                    leagueLimitId: leagueLimit.id,
                    contestCategoryId,
                  },
                  update: otherFields,
                });
              },
            ),
          );
        },
        {
          maxWait: 10000, // default: 2000
          timeout: 10000, // default: 5000
        },
      );
    } catch (error) {
      logger.error('There was an error updating league limits', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  });
