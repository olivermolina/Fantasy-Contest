/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { League, Market, MarketResult, Prisma } from '@prisma/client';
import winston from 'winston';
import prisma from '~/server/prisma';
import defaultLogger from '~/utils/logger';
import EVAnalytics, { LeagueEnum } from '../ev-analytics/EVAnaltyics';
import { ILookupRepsonse } from '../ev-analytics/ILookupResponse';
import { IOddsResponse } from '../ev-analytics/IOddsResponse';
import { getMarketOddsRange } from '~/server/routers/contest/getMarketOddsRange';
import {
  isMarketActive,
  MarketOddsRangeInterface,
} from '~/utils/isMarketActive';

type MarketType = IOddsResponse['events'][0]['markets'][0];

const mapOffer = (
  e: IOddsResponse['events'][0],
  league: Prisma.OfferCreateWithoutMarketsInput['league'],
) =>
  ({
    gid: `${e.gid.toString()}-${league.toLowerCase()}`,
    gamedate: e.gamedate,
    epoch: e.epoch,
    start_utc: e.start_utc,
    end_utc: e.end_utc,
    inplay: e.inplay,
    status: e.status.replace('-', '').replace('/', ''),
    matchup: e.matchup,
    gametime: e.gametime,
    homeTeamId: `${e.home?.id?.toString()}-${league.toLowerCase()}`,
    awayTeamId: `${e.away?.id?.toString()}-${league.toLowerCase()}`,
    league,
  } as Prisma.XOR<
    Prisma.OfferCreateWithoutMarketsInput,
    Prisma.OfferUncheckedCreateWithoutMarketsInput
  >);

const mapResult = (res: MarketType['over_result']): MarketResult => {
  switch (res) {
    case 0:
      return MarketResult.Zero;
    case 1:
      return MarketResult.One;
    case null:
    default:
      return MarketResult.Null;
  }
};

export type IngestOptionsType = {
  teams?: boolean;
  players?: boolean;
  offers?: boolean;
  markets?: boolean;
  initialData?: IOddsResponse | null;
  initialLookup?: ILookupRepsonse | null;
};

export const ingest = async (
  leagues = Object.values(LeagueEnum),
  options?: IngestOptionsType,
) => {
  const logger = defaultLogger.child({ leagues: leagues.toString() });
  const profiler = logger.startTimer();
  logger.info(`Ingesting for leagues: ${leagues}`);
  const allCounts = [];
  for (const league of leagues) {
    const data =
      options?.initialData || (await getData(league, logger, options));
    const lookups =
      options?.initialLookup || (await getLookups(league, logger, options));
    if (data?.events?.length && lookups) {
      const { teams, players } = lookups;
      const counts = {
        games: data.events.length,
        teams: teams.length,
        players: players.length,
        markets: data.events.reduce<number>(
          (count, event) => count + event.markets.length,
          0,
        ),
      };
      allCounts.push(counts);
      logger.info(`Fetched ${counts.games} games`);

      if (options?.players) {
        logger.info(`Fetched ${counts.players} players`);
        const playersProfile = logger.startTimer();
        const playerData = players.map(({ id, teamid, ...otherFields }) => ({
          ...otherFields,
          id: `${id.toString()}-${league}`,
          teamid: `${teamid.toString()}-${league}`,
        }));

        // Insert or update players in case they have changed teams
        await prisma.$executeRaw`
            INSERT INTO "Player" (
              id, teamid, name, position, team, headshot
            )
            VALUES ${Prisma.join(
              playerData.map(
                (player: any) =>
                  Prisma.sql`(${Prisma.join([
                    player.id,
                    player.teamid,
                    player.name,
                    player.position,
                    player.team,
                    player.headshot,
                  ])})`,
              ),
            )}
            ON CONFLICT (id) DO UPDATE SET
              teamid = EXCLUDED.teamid,
              name = EXCLUDED.name,
              position = EXCLUDED.position,
              team = EXCLUDED.team,
              headshot = EXCLUDED.headshot;
        `;

        playersProfile.done({ message: 'Finished creating players.' });
      }

      if (options?.teams) {
        logger.info(`Fetched ${counts.teams} teams`);
        const teamsProfile = logger.startTimer();
        await prisma.team.createMany({
          skipDuplicates: true,
          data: teams.map((t) => ({
            id: `${t.id.toString()}-${league}`,
            name: t.name,
            code: t.abbreviation || 'NA',
          })),
        });
        teamsProfile.done({ message: 'Finished creating teams.' });
      }

      const marketOddsRange = await getMarketOddsRange();
      if (options?.offers || options?.markets) {
        const teamMap: TeamMapType = new Map(
          teams.map((t) => [
            `${t.id.toString()}-${league}`,
            {
              ...t,
              id: `${t.id.toString()}-${league}`,
              code: t.abbreviation,
            },
          ]),
        );

        const playersMap: PlayerMapType = new Map(
          players.map((p) => [
            `${p.id.toString()}-${league}`,
            { ...p, id: `${p.id.toString()}-${league}`, Team: undefined },
          ]),
        );

        const offersProfile = logger.startTimer();
        // Get all markets with market overrides
        const marketIds = data.events.flatMap((e) =>
          e.markets.map((m) => m.id),
        );
        const marketsWithMarketOverride = await prisma.market.findMany({
          where: {
            id: {
              in: marketIds,
            },
            NOT: {
              MarketOverride: null,
            },
          },
          include: {
            MarketOverride: true,
          },
        });

        await Promise.allSettled([
          ...data.events.flatMap((e) => {
            let offer;
            let markets: Prisma.Prisma__MarketClient<Market>[] = [];
            if (options?.offers) {
              offer = prisma.offer.upsert({
                where: { gid: `${e.gid.toString()}-${league}` },
                create: mapOffer(e, league.toUpperCase() as League),
                update: mapOffer(e, league.toUpperCase() as League),
              });
            }
            if (options?.markets) {
              markets = e.markets.map((m) =>
                prisma.market.upsert({
                  where: {
                    id_sel_id: {
                      id: m.id,
                      sel_id: m.sel_id,
                    },
                  },
                  create: mapMarkets(
                    m,
                    e,
                    playersMap,
                    teamMap,
                    league,
                    marketOddsRange,
                  ),
                  update: mapMarkets(
                    m,
                    e,
                    playersMap,
                    teamMap,
                    league,
                    marketsWithMarketOverride.find(
                      (market) => market.id === m.id,
                    )
                      ? undefined
                      : marketOddsRange,
                  ),
                }),
              );
            }
            return [offer, ...markets];
          }),
        ]);

        // Update markets with market overrides
        await Promise.allSettled([
          ...marketsWithMarketOverride.map((m) => {
            const currentMarket = data.events
              .flatMap((e) => e.markets)
              .find(
                (market) => market.id === m.id && market.sel_id === m.sel_id,
              );

            if (!currentMarket) {
              return [m];
            }

            const hasChanged =
              Number(m.MarketOverride?.total) !== Number(currentMarket.total) ||
              Number(m.MarketOverride?.under) !== Number(currentMarket.under) ||
              Number(m.MarketOverride?.over) !== Number(currentMarket.over);
            return [
              prisma.market.update({
                where: {
                  id_sel_id: {
                    id: m.id,
                    sel_id: m.sel_id,
                  },
                },
                data: {
                  active: hasChanged
                    ? isMarketActive(
                        {
                          over: Number(currentMarket?.over),
                          under: Number(currentMarket?.under),
                        },
                        marketOddsRange,
                      )
                    : m.MarketOverride?.active,

                  // If the market override original values is different from the current market, delete it
                  ...(hasChanged && {
                    marketOverrideId: undefined,
                    MarketOverride: {
                      delete: true,
                    },
                  }),
                },
              }),
            ];
          }),
        ]);

        offersProfile.done({
          message: `Finished creating ${options?.offers ? 'offers' : ' '} ${
            options?.markets ? 'markets' : ''
          }. Market overrides: ${marketsWithMarketOverride.length}`,
        });
      }
    }
  }
  profiler.done({
    name: 'Ingest',
    message: 'Completed ingestion.',
    allCounts,
    options: {
      teams: options?.teams,
      players: options?.players,
      offers: options?.offers,
      markets: options?.markets,
      initialData: !!options?.initialData,
      initialLookup: !!options?.initialLookup,
    },
  });
};
type PlayerMapType = Map<
  Prisma.PlayerCreateWithoutMarketInput['id'],
  Prisma.PlayerCreateWithoutMarketInput
>;

type TeamMapType = Map<
  Prisma.TeamCreateWithoutMarketInput['id'],
  Prisma.TeamCreateWithoutMarketInput
>;

export async function getLookups(
  league: LeagueEnum,
  logger?: winston.Logger,
  options?: IngestOptionsType,
) {
  const lookupProfile = logger?.startTimer();
  const lookups =
    options?.initialLookup || (await EVAnalytics.getLookups(league));
  lookupProfile?.done({ message: 'Finished fetching lookups' });
  return lookups;
}

export async function getData(
  league: LeagueEnum,
  logger?: winston.Logger,
  options?: IngestOptionsType,
  date?: Date,
) {
  const dataProfile = logger?.startTimer();
  const data =
    options?.initialData || (await EVAnalytics.getLeague(league, date));
  dataProfile?.done({ message: 'Finished fetching data.' });
  return data;
}

function mapMarkets(
  m: MarketType,
  e: IOddsResponse['events'][0],
  players: PlayerMapType,
  teams: TeamMapType,
  league: string,
  marketOddsRange?: MarketOddsRangeInterface,
): Prisma.MarketCreateManyInput {
  const createPlayer = players.get(`${m.sel_id.toString()}-${league}`)!;
  const createTeam = teams.get(`${m.sel_id.toString()}-${league}`)!;
  return {
    id: m.id,
    sel_id: m.sel_id,
    ...(m.type === 'PP'
      ? {
          playerId: createPlayer.id,
        }
      : {
          teamId: createTeam.id,
        }),
    offerId: `${e.gid.toString()}-${league.toLowerCase()}`,
    type: m.type,
    category: m.category,
    name: m.name,
    teamAbbrev: m.team,
    offline: m.offline,
    spread: m.spread,
    spread_odd: m.spread_odd,
    total: m.total,
    over: m.over,
    under: m.under,
    moneyline: m.moneyline,
    spread_bet: m.spread_bet,
    spread_cash: m.spread_cash,
    over_bet: m.over_bet,
    under_bet: m.under_bet,
    over_cash: m.over_cash,
    under_cash: m.under_cash,
    moneyline_bet: m.moneyline_bet,
    moneyline_cash: m.moneyline_cash,
    spread_result: mapResult(m.spread_result),
    spread_stat: m.spread_stat,
    over_result: mapResult(m.over_result),
    under_result: mapResult(m.under_result),
    total_stat: m.total_stat,
    moneyline_result: mapResult(m.moneyline_result),
    moneyline_stat: m.moneyline_stat,
    ...(marketOddsRange && {
      active: isMarketActive(
        { over: Number(m.over), under: Number(m.under) },
        marketOddsRange,
      ),
    }),
  };
}
