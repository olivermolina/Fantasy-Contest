import { League, MarketType } from '@prisma/client';
import { t } from '~/server/trpc';
import prisma from '~/server/prisma';
import { getFantasyOffers } from '~/server/routers/contest/getFantasyOffers';

export interface LeagueFantasyOffersCount {
  league: League;
  count: number;
}

/**
 * This will get the list of league fantasy offers count
 */
export const getLeagueFantasyOffersCount = t.procedure.query(async () => {
  const [leagues, leaguesMarketCounts] = await prisma.$transaction([
    prisma.leagueCategory.findMany({
      orderBy: {
        order: 'asc',
      },
    }),
    prisma.leaguesMarketCount.findMany(),
  ]);

  return Promise.all(
    leagues.map(async ({ league }) => {
      const leagueOffers = leaguesMarketCounts.find(
        (row) => row.league === league,
      );
      let count = leagueOffers?.count || 0;
      if (!leagueOffers) {
        const leagueOffers = await getFantasyOffers(league);
        count = leagueOffers.filter(
          (offer) => offer.type === MarketType.PP,
        ).length;
      }
      return {
        league,
        count,
      } as LeagueFantasyOffersCount;
    }),
  );
});
