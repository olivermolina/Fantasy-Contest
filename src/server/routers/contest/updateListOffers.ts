import { getFantasyOffers } from '~/server/routers/contest/getFantasyOffers';
import { t } from '~/server/trpc';
import prisma from '~/server/prisma';
import { League, Prisma } from '@prisma/client';

/**
 * This will update the list of league fantasy offers for a specific league
 * @param league
 * @param count - optional
 */
export const innerFn = async (league: League, count?: number | null) => {
  const leagueOffers =
    Number(count) > 0 ? await getFantasyOffers(league) : null;
  return await prisma.listOffer.upsert({
    where: {
      league,
    },
    create: {
      league,
      jsonData: leagueOffers as unknown as Prisma.JsonArray,
    },
    update: {
      jsonData: leagueOffers as unknown as Prisma.JsonArray,
    },
  });
};

/**
 * This will update the list offers for each league
 */
export const updateListOffers = t.procedure.query(async () => {
  const leagues = await prisma.leaguesMarketCount.findMany();
  return Promise.all(
    leagues.map(async ({ league, count }) => await innerFn(league, count)),
  );
});

export default updateListOffers;
