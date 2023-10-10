import { adminProcedure } from './middleware/isAdmin';
import prisma from '~/server/prisma';
import * as yup from '~/utils/yup';
import {
  Bet,
  BetLeg,
  BetLegType,
  League,
  Market,
  MarketType,
  Offer,
  User,
} from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getDateStringRangeList } from '~/utils/getDateStringRangeList';

dayjs.extend(utc);
dayjs.extend(timezone);

interface BetLegLineExposure {
  id: string;
  betId: string;
  type: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  entryDate: string;
  stake: number;
  payout: number;
  status: string;
}

export interface ILineExposure {
  id: string;
  name: string;
  category: string;
  matchup: string;
  overOdds: number;
  underOdds: number;
  overExposure: number;
  underExposure: number;
  league: string;
  gamedate: string;
  gametime: string;
  status: string;
  total: number;
  betLegs: BetLegLineExposure[];
}

type MarketExposureType = Market & {
  BetLeg: (BetLeg & { Bet: (Bet & { owner: User }) | null })[];
  offer: Offer | null;
};

/**
 * This function will map the market PP type to line exposures
 * @param market {MarketExposureType}
 * @return {ILineExposure[]}
 */
const mapLineExposures = (market: MarketExposureType) => {
  return {
    id: market.id,
    name: market.name,
    category: market.category,
    matchup: market.offer?.matchup,
    overOdds: Number(market.over),
    underOdds: Number(market.under),
    overExposure: market.BetLeg.filter(
      (betLeg) => betLeg.type === BetLegType.OVER_ODDS,
    ).length,
    underExposure: market.BetLeg.filter(
      (betLeg) => betLeg.type === BetLegType.UNDER_ODDS,
    ).length,
    league: market.offer?.league.toString(),
    gamedate: market.offer?.gamedate,
    gametime: market.offer?.gametime,
    status: market.offer?.status.toString(),
    total: Number(market.total),
    finalStat: Number(market.total_stat),
    betLegs: market.BetLeg.map((leg) => ({
      id: leg.id,
      betId: leg.betId,
      type: leg.type,
      user: {
        id: leg.Bet?.userId || '',
        firstName: leg.Bet?.owner.firstname || '',
        lastName: leg.Bet?.owner.lastname || '',
        username: leg.Bet?.owner.username || '',
      },
      entryDate: dayjs(leg.Bet?.created_at)
        .tz('America/New_York')
        .format('YYYY-MM-DD'),
      stake: Number(leg.Bet?.stake),
      payout: Number(leg.Bet?.payout),
      status: leg.status,
    })),
  } as ILineExposure;
};

/**
 * This will return the list of market line exposures within the given date range and league
 *
 * @param input.dateFrom {string} - start date string with YYYY-MM-DD format
 * @param input.dateTo {string} - end date string with YYYY-MM-DD format
 * @param input.league {string} - one of the supported league enums in the application
 * @return ILineExposure[]
 */
export const innerFn = async ({
  input,
}: {
  input: { dateFrom: string; dateTo: string; league: League };
}) => {
  const markets = await prisma.market.findMany({
    where: {
      type: MarketType.PP,
      NOT: {
        BetLeg: {
          none: {},
        },
      },
      offer: {
        league: input.league,
        gamedate: {
          in: getDateStringRangeList(
            new Date(input.dateFrom),
            new Date(input.dateTo),
          ),
        },
      },
    },
    include: {
      BetLeg: {
        include: {
          Bet: {
            include: {
              owner: true,
            },
          },
        },
      },
      offer: true,
    },
  });

  return markets.map(mapLineExposures);
};

const getLineExposures = adminProcedure
  .input(
    yup.object({
      dateFrom: yup.string().required(),
      dateTo: yup.string().required(),
      league: yup.mixed<League>().default(League.NFL),
    }),
  )
  .query(innerFn);

export default getLineExposures;
