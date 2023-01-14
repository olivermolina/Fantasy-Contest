/* eslint-disable import/no-unused-modules */
import dayjs from 'dayjs';
import { ILookupRepsonse } from './ILookupResponse';
import { IOddsResponse } from './IOddsResponse';
import { League } from '@prisma/client';

export enum LeagueEnum {
  NFL = 'nfl',
  MLB = 'mlb',
  NBA = 'nba',
  NHL = 'nhl',
  NCAAF = 'ncaaf',
  NCAAB = 'ncaab',
  TENNIS = 'tennis',
  MMA = 'mma',
  GOLF = 'golf',
  SOCCER = 'soccer',
}

export const mapPrismaLeagueToLeagueEnum = (league?: League) => {
  switch (league) {
    case 'NFL':
      return LeagueEnum.NFL;
    case 'MLB':
      return LeagueEnum.MLB;
    case 'NBA':
      return LeagueEnum.NBA;
    case 'NCAAB':
      return LeagueEnum.NCAAB;
    case 'NCAAF':
      return LeagueEnum.NCAAF;
    case 'NHL':
      return LeagueEnum.NHL;
    case 'MMA':
      return LeagueEnum.MMA;
    case 'GOLF':
      return LeagueEnum.GOLF;
    case 'SOCCER':
      return LeagueEnum.SOCCER;
    case 'TENNIS':
      return LeagueEnum.TENNIS;
    default:
      return LeagueEnum.NFL;
  }
};

export const formatDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');

export const getLeague = async (
  league: LeagueEnum,
  date?: Date,
  game?: number,
): Promise<IOddsResponse | null> => {
  const params = new URLSearchParams();
  if (date) {
    const dateString = formatDate(date);
    params.set('date', dateString);
  }
  if (game) {
    params.set('game', game.toString());
  }
  const result = await fetch(formatGetLeagueURL(league, params), {
    headers: {
      'x-api-key': process.env.EV_ANALYTICS_API_KEY || '',
    },
  });

  try {
    return await result.json();
  } catch (error) {
    return null;
  }
};

export const getLookups = async (
  league: LeagueEnum,
): Promise<ILookupRepsonse | null> => {
  const result = await fetch(
    `https://api.evanalytics.com/v1/lookups/leagues/${league}`,
    {
      headers: {
        'x-api-key': process.env.EV_ANALYTICS_API_KEY || '',
      },
    },
  );

  try {
    return await result.json();
  } catch (error) {
    return null;
  }
};

export function formatGetLeagueURL(
  league: LeagueEnum,
  params: URLSearchParams,
): RequestInfo | URL {
  return `https://api.evanalytics.com/odds/v1/leagues/${league}?${params}`;
}

const EVAnalytics = {
  getLookups,
  getLeague,
};

export default EVAnalytics;
