import { League, MarketType } from '@prisma/client';
import { getFantasyOffers } from '~/server/routers/contest/getFantasyOffers';
import { t } from '~/server/trpc';
import prisma from '~/server/prisma';

/**
 * This will update the list of league fantasy offers count for a specific league
 * @param league
 * @returns LeaguesMarketCount
 */

export const innerFn = async (league: League) => {
  const leagueOffers = await getFantasyOffers(league);
  const count = leagueOffers.filter(
    (offer) => offer.type === MarketType.PP,
  ).length;

  return await prisma.leaguesMarketCount.upsert({
    where: {
      league,
    },
    create: {
      league,
      count,
    },
    update: {
      league,
      count,
    },
  });
};

/**
 * This will update the list of league fantasy offers count
 */
export const updateLeaguesMarketCount = t.procedure.query(async () => {
  const leagues = await prisma.leagueCategory.findMany({
    orderBy: {
      order: 'asc',
    },
  });

  return Promise.all(leagues.map(async ({ league }) => await innerFn(league)));
});

export default updateLeaguesMarketCount;
