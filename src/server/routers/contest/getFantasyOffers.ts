import { League, Status } from '@prisma/client';
import { FantasyOffer } from '~/types';
import prisma from '~/server/prisma';
import { mapData, MarketMapData } from '~/server/routers/contest/mapData';
import { filter } from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getMarketOddsRange } from '~/server/routers/contest/getMarketOddsRange';
import { appNodeCache } from '~/lib/node-cache/AppNodeCache';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

/**
 * This function gets all the fantasy offers currently available for a given league
 *
 * It will check for players with upcoming games in the next week (that have not started), and then give an over under based on their estimated
 * statline that will be 50/50 odds either way with a push for the exact value.
 *
 * @param league one of the supported league enums in the application
 * @param cache whether or not to use the cache for this request
 */
export async function getFantasyOffers(
  league: League,
  cache?: boolean,
): Promise<FantasyOffer[]> {
  const marketOddsRange = await getMarketOddsRange();

  let markets = cache ? (appNodeCache.get(league) as MarketMapData[]) : [];
  if (!markets || markets.length === 0) {
    markets = await prisma.market.findMany({
      where: {
        offer: {
          league,
          status: Status.Scheduled,
        },
        over: {
          gte: marketOddsRange.MIN,
          lte: marketOddsRange.MAX,
        },
        under: {
          gte: marketOddsRange.MIN,
          lte: marketOddsRange.MAX,
        },
      },
      include: {
        offer: true,
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
    appNodeCache.set(league, markets, 300);
  }

  return filter(markets.map(mapData), (offer) => {
    // https://dcg.atlassian.net/browse/LOC-443
    // Filter out over and under odds that is not fall between -150 to +150
    if (
      offer.overOdds > marketOddsRange.MAX ||
      offer.underOdds < marketOddsRange.MIN ||
      offer.underOdds > marketOddsRange.MAX ||
      offer.underOdds < marketOddsRange.MIN
    ) {
      return false;
    }

    const currentDateTimeEST = dayjs().tz('America/New_York');
    const matchTimeEst = dayjs(`${offer.matchTime} EST`).tz('America/New_York');

    const timeRemainingInHours = matchTimeEst.diff(
      currentDateTimeEST,
      'h',
      true,
    );
    // return offer where time remaining is more than 0
    return timeRemainingInHours > 0;
  });
}
