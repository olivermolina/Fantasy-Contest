// import { verifySignature } from '@upstash/qstash/nextjs';
import chunk from 'lodash.chunk';
import { NextApiRequest, NextApiResponse } from 'next';
import { TOKEN } from '~/constants/TOKEN';
import { getData, getLookups } from '~/lib/etl/Ingest';
import {
  LeagueEnum,
  mapPrismaLeagueToLeagueEnum,
} from '~/lib/ev-analytics/EVAnaltyics';
import { appRouter } from '~/server/routers/_app';
import defaultLogger from '~/utils/logger';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { compact, filter, uniq } from 'lodash';
import { Market } from '~/lib/ev-analytics/IOddsResponse';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const caller = appRouter.createCaller({} as any);

const handleIngest = async (
  leagues: LeagueEnum[],
  gamedate?: Date,
  isGradingOnly?: boolean,
) => {
  for (const league of leagues) {
    const logger = defaultLogger.child({ leagues: league });
    logger.info('Ingesting data for league');

    const data = await getData(league, logger, undefined, gamedate);
    const events = data?.events || [];

    const gradePromise = [];
    for (const offer of events) {
      if (offer.status === 'Final') {
        gradePromise.push(
          caller.bets.grade({
            markets: offer.markets,
            token: TOKEN,
          }),
        );
      }
    }
    await Promise.allSettled(gradePromise);

    caller.bets.createMissingWinTransaction({
      token: TOKEN,
    });

    if (isGradingOnly) {
      logger.info(
        'Ingesting data for league is cancelled. Only grading is allowed',
      );
      return;
    }

    const lookups = await getLookups(league, logger);

    // Get players
    caller.etl.ingestByLeague({
      league,
      token: TOKEN,
      options: {
        players: true,
        initialData: data,
        initialLookup: lookups,
      },
    });

    // Get teams
    caller.etl.ingestByLeague({
      league,
      token: TOKEN,
      options: {
        teams: true,
        initialData: data,
        initialLookup: lookups,
      },
    });

    for (const offerChunk of chunk(events, 3)) {
      caller.etl.ingestByLeague({
        league,
        token: TOKEN,
        options: {
          offers: true,
          markets: true,
          initialData: {
            events: offerChunk,
          },
          initialLookup: lookups,
        },
      });
    }
  }
};

// This function will ingest past events and settle picks by date
const handlePastIngest = async (isGradingOnly?: boolean) => {
  // Grade previous days pending picks
  const pendingBetLegs = await caller.bets.pendingBetLegs({
    token: TOKEN,
  });
  const todayUtc = dayjs().utc();
  const todayFormatted = dayjs(todayUtc.format('YYYY-MM-DD'));
  const filterPreviousPendingBetLegs = filter(pendingBetLegs, (betLeg) => {
    const createdAtUTC = dayjs(betLeg.created_at).utc();
    const formattedDate = dayjs(createdAtUTC.format('YYYY-MM-DD'));
    const daysOld = todayFormatted.diff(formattedDate, 'd');

    // settle picks that are 1 day old
    return daysOld >= 1;
  });

  if (filterPreviousPendingBetLegs && filterPreviousPendingBetLegs.length > 0) {
    const gamedates = uniq(
      compact(
        filterPreviousPendingBetLegs.map(
          (betLeg) => betLeg.market?.offer?.gamedate,
        ),
      ),
    );

    for (const gamedate of gamedates) {
      const formattedGameDate = dayjs(dayjs(gamedate).format('YYYY-MM-DD'));
      const daysOld = todayFormatted.diff(formattedGameDate, 'd');
      // Exclude bet leg if game date is future
      if (daysOld <= 0) continue;

      const leagues = uniq(
        compact(
          pendingBetLegs.map((l) => {
            if (!l.market?.offer?.league) return false;
            if (l.market?.offer.gamedate !== gamedate) return false;
            return mapPrismaLeagueToLeagueEnum(l.market?.offer?.league);
          }),
        ),
      );
      await handleIngest(leagues, new Date(gamedate), isGradingOnly);
    }
  }
};

// Get all offers with pending bets and grade if status is Final
const gradeManualOffersWithPendingBets = async () => {
  const manualOffers = await caller.bets.getManualOffersWithPendingBets({
    token: TOKEN,
  });

  for (const offer of manualOffers) {
    if (offer.status === 'Final') {
      void caller.bets.grade({
        markets: offer.markets.map((market: unknown) => market as Market),
        token: TOKEN,
      });
    }
  }
};

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const queryDateString = _req?.query?.date as string;
  const queryGrade = _req?.query?.grade as string;
  const isGradingOnly = Number(queryGrade) == 1;
  const gamedate = queryDateString ? new Date(queryDateString) : undefined;
  const defaultLeagues = Object.values(LeagueEnum);

  await Promise.allSettled([
    // Ingest and grade current data
    handleIngest(defaultLeagues, gamedate, isGradingOnly),

    // Sometimes the picks are not settled if the events are not found in the
    // default ingest, so we have to query all pending picks and ingest by date
    handlePastIngest(isGradingOnly),

    // Grade manual offers
    gradeManualOffersWithPendingBets(),
  ]);

  res.status(200).end();
}

// const handlerWrapper =
//   process.env.NODE_ENV === 'development' ? handler : verifySignature(handler);
// export default handlerWrapper;

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
