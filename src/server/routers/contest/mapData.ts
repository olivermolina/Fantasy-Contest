import {
  ContestCategory,
  FreeSquare,
  FreeSquareContestCategory,
  Market,
  MarketOverride,
  Offer,
  Player,
  Team,
  TournamentEvent,
} from '@prisma/client';
import { FantasyOffer } from '~/types';
import * as StatNames from '~/server/routers/IStatNames';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { formatMatchTime } from '~/utils/formatMatchTime';

dayjs.extend(utc);
dayjs.extend(timezone);

export type MarketMapData = Market & {
  offer:
    | (Offer & {
        TournamentEvent: TournamentEvent | null;
        home: Team;
        away: Team;
      })
    | null;
  player: Player | null;
  FreeSquare:
    | (FreeSquare & {
        FreeSquareContestCategory: (FreeSquareContestCategory & {
          contestCategory: ContestCategory;
        })[];
      })
    | null;
  MarketOverride: MarketOverride | null;
};

export const mapData = (
  data: MarketMapData,
  isFreeSquare?: boolean,
): FantasyOffer => {
  return {
    id: data.id,
    playerId: data.player?.id || '',
    playerPhotoURL: data.player?.headshot
      ? data.player?.headshot
      : `https://evanalytics.com/images/${data.offer?.league.toLowerCase()}/${
          data.teamAbbrev
        }.png`,
    statName: data.category as StatNames.all,
    total: data.MarketOverride?.adjustedTotal || data.total || 0,
    matchName: data.offer!.away.code + ' @ ' + data.offer!.home.code,
    playerName: data.name,
    tags: [],
    marketId: data.id,
    selId: data.sel_id,
    league: data.offer!.league,
    matchTime: formatMatchTime(data.offer!.gamedate, data.offer!.gametime),
    matchDateTime: dayjs
      .tz(
        `${data.offer!.gamedate} ${data.offer!.gametime || '00:00:00'}`,
        'America/New_York',
      )
      .toDate(),
    odds: 100,
    overOdds: Number(data.MarketOverride?.adjustedOver || data.over),
    underOdds: Number(data.MarketOverride?.adjustedUnder || data.under),
    playerPosition: data.player?.position || '',
    playerTeam: data.player?.team || '',
    type: data.type,
    playerTeamId: data.player?.teamid || '',
    freeSquare:
      isFreeSquare && data.FreeSquare
        ? {
            id: data.FreeSquare.id,
            discount: Number(data.FreeSquare?.discount) || 0,
            freeEntryEnabled: data.FreeSquare?.freeEntryEnabled,
            maxStake: Number(data.FreeSquare?.maxStake) || 0,
            pickCategories:
              data.FreeSquare?.FreeSquareContestCategory.map(
                (row) => row.contestCategory,
              ) || [],
          }
        : null,
    originalTotal: Number(data.total),
    originalUnderOdds: Number(data.under),
    originalOverOdds: Number(data.over),
    adjustedTotal: data.MarketOverride?.adjustedTotal,
    adjustedUnderOdds: data.MarketOverride?.adjustedUnder,
    adjustedOverOdds: data.MarketOverride?.adjustedOver,
    active: data.active,
    eventName: data.offer?.TournamentEvent?.name || '',
  };
};
