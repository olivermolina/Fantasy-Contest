import { League, Status } from '@prisma/client';
import { FantasyOffer } from '~/types';
import { prisma } from '~/server/prisma';
import { mapData } from '~/server/routers/contest/mapData';
import { filter } from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

/**
 * This function gets all the fantasy offers currently available for a given league.
 *
 * It will check for players with upcoming games in the next week (that have not started), and then give an over under based on their estimated
 * statline that will be 50/50 odds either way with a push for the exact value.
 *
 * @param league one of the supported league enums in the application
 */
export async function getFantasyOffers(
  league: League,
): Promise<FantasyOffer[]> {
  const markets = await prisma.market.findMany({
    where: {
      offer: {
        league,
        status: Status.Scheduled,
      },
    },
    include: {
      offer: true,
      player: true,
    },
  });

  return filter(markets.map(mapData), (offer) => {
    const currentDateTimeUtc = dayjs().utc();
    const matchTimeEstToUtc = dayjs(`${offer.matchTime} EST`).utc();
    const timeRemainingInHours = matchTimeEstToUtc.diff(
      currentDateTimeUtc,
      'h',
      true,
    );
    // return offer where time remaining is more than 0
    return timeRemainingInHours > 0;
  });
}
