import prisma from '~/server/prisma';
import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import z from 'zod';
import { League } from '@prisma/client';
import { innerFn as updateLeagueMarketCount } from '~/server/routers/contest/updateLeaguesMarketCount';
import { innerFn as updateListOffer } from '~/server/routers/contest/updateListOffers';

const deleteFreeSquarePromotion = adminProcedure
  .input(
    z.object({
      id: z.string(),
      league: z.nativeEnum(League),
    }),
  )
  .mutation(async ({ input }) => {
    const result = await prisma.$transaction([
      prisma.freeSquareContestCategory.deleteMany({
        where: {
          freeSquareId: input.id,
        },
      }),
      prisma.freeSquare.delete({
        where: {
          id: input.id,
        },
      }),
    ]);

    await Promise.all([
      updateLeagueMarketCount(input.league),
      updateListOffer(input.league),
    ]);

    return result;
  });
export default deleteFreeSquarePromotion;
