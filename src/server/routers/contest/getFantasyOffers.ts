import { League, Offer, Status } from '@prisma/client';
import { FantasyOffer } from '~/types';
import prisma from '~/server/prisma';
import { mapData } from '~/server/routers/contest/mapData';
import { filter } from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

/**
 * This function checks if the market is available for the user to play
 * @param market the market object
 * @returns true if the market is available, false otherwise
 */
export function isMarketAvailable(market: { offer: Offer | null }) {
  if (market.offer!.gamedate === '' || market.offer!.gametime === '') {
    return false;
  }

  const currentDateTimeET = dayjs().tz('America/New_York');
  const matchTimeET = dayjs.tz(
    `${market.offer!.gamedate} ${market.offer!.gametime}`,
    'America/New_York',
  );

  const timeRemainingInHours = matchTimeET.diff(currentDateTimeET, 'h', true);
  // If the match is in the past, return false
  return timeRemainingInHours > 0;
}

/**
 * This function gets all the fantasy offers currently available for a given league
 *
 * It will check for players with upcoming games in the next week (that have not started), and then give an over under based on their estimated
 * statline that will be 50/50 odds either way with a push for the exact value.
 *
 * @param league one of the supported league enums in the application
 * @param includeInactive whether or not to include inactive offers
 * @param oddsRange the range of odds to filter by
 */
export async function getFantasyOffers(
  league: League,
  includeInactive?: boolean,
  oddsRange?: { min: number; max: number },
): Promise<FantasyOffer[]> {
  const markets = await prisma.market.findMany({
    where: {
      offer: {
        league,
        status: Status.Scheduled,
      },
      ...(includeInactive ? {} : { active: true }),
      ...(oddsRange
        ? {
            over: { gte: oddsRange.min, lte: oddsRange.max },
            under: { gte: oddsRange.min, lte: oddsRange.max },
          }
        : {}),
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

  const filteredMarkets = filter(markets, (market) => {
    if (!includeInactive && !market.active) {
      return false;
    }

    return isMarketAvailable(market);
  });

  const freeSquareMarkets = filteredMarkets.filter(
    (markets) =>
      markets.FreeSquare !== null && markets.FreeSquare !== undefined,
  );

  return [
    ...freeSquareMarkets.map((market) => mapData(market, true)),
    ...filteredMarkets.map((market) => mapData(market)),
  ];
}
