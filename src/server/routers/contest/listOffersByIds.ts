import { t } from '~/server/trpc';
import { prisma } from '~/server/prisma';
import z from 'zod';
import { mapData } from '~/server/routers/contest/mapData';

const listOffersByIds = t.procedure
  .input(
    z.object({
      offerIds: z.string().array().nonempty({
        message: 'At least one offerId is required',
      }),
    }),
  )
  .query(async ({ input }) => {
    const markets = await prisma.market.findMany({
      where: {
        id: {
          in: input.offerIds,
        },
      },
      include: {
        offer: {
          include: {
            TournamentEvent: true,
            home: true,
            away: true,
          },
        },
        player: true,
        FreeSquare: {
          include: {
            FreeSquareContestCategory: {
              include: {
                contestCategory: true,
              },
            },
          },
        },
        MarketOverride: true,
      },
    });
    return markets.map((market) => mapData(market));
  });

export default listOffersByIds;
