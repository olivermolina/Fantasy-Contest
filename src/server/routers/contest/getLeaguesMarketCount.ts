import { League, MarketType } from '@prisma/client';
import { getFantasyOffers } from '~/server/routers/contest/getFantasyOffers';
import { t } from '~/server/trpc';

export interface LeagueFantasyOffersCount {
  league: League;
  count: number;
}

/**
 * This will get the list of league fantasy offers count
 */
export const getLeagueFantasyOffersCount = t.procedure.query(async () => {
  return Promise.all(
    Object.values(League).map(async (league) => {
      const leagueOffers = await getFantasyOffers(league);
      return {
        league,
        count: leagueOffers.filter((offer) => offer.type === MarketType.PP)
          .length,
      } as LeagueFantasyOffersCount;
    }),
  );
});
