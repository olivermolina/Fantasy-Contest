import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { innerFn as updateLeagueMarketCount } from '~/server/routers/contest/updateLeaguesMarketCount';
import { innerFn as updateListOffer } from '~/server/routers/contest/updateListOffers';
import z from 'zod';
import { League } from '@prisma/client';

const deleteTournamentEventOffer = adminProcedure
  .input(
    z.object({
      id: z.string(),
      league: z.nativeEnum(League),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      const result = await prisma.$transaction(
        async (trx) => {
          await trx.market.deleteMany({
            where: {
              offerId: input.id,
            },
          });

          return await trx.offer.delete({
            where: {
              gid: input.id,
            },
          });
        },
        {
          maxWait: 10000, // default: 2000
          timeout: 10000, // default: 5000
        },
      );

      await Promise.all([
        updateLeagueMarketCount(input.league),
        updateListOffer(input.league),
      ]);

      return result;
    } catch (e) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.TOURNAMENT_DELETE_WITH_ENTRY_ERROR,
      });
    }
  });

export default deleteTournamentEventOffer;
