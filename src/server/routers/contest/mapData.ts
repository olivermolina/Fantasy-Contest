import {
  ContestCategory,
  FreeSquare,
  FreeSquareContestCategory,
  Market,
  Offer,
  Player,
} from '@prisma/client';
import { FantasyOffer } from '~/types';
import * as StatNames from '~/server/routers/IStatNames';
import dayjs from 'dayjs';
import { EntryDatetimeFormat } from '~/constants/EntryDatetimeFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export type MarketMapData = Market & {
  offer: Offer | null;
  player: Player | null;
  FreeSquare:
    | (FreeSquare & {
        FreeSquareContestCategory: (FreeSquareContestCategory & {
          contestCategory: ContestCategory;
        })[];
      })
    | null;
};

export const mapData = (data: MarketMapData): FantasyOffer => {
  return {
    id: data.id,
    playerId: data.player?.id || '',
    playerPhotoURL: data.player?.headshot
      ? data.player?.headshot
      : `https://evanalytics.com/images/${data.offer?.league.toLowerCase()}/${
          data.teamAbbrev
        }.png`,
    statName: data.category as StatNames.all,
    total: data.total || 0,
    matchName: data.offer?.matchup || '',
    playerName: data.name,
    tags: [],
    marketId: data.id,
    selId: data.sel_id,
    league: data.offer!.league,
    matchTime: dayjs(`${data.offer!.gamedate} ${data.offer!.gametime} EST`)
      .tz('America/New_York')
      .format(EntryDatetimeFormat),
    odds: 100,
    overOdds: Number(data.over),
    underOdds: Number(data.under),
    playerPosition: data.player?.position || '',
    playerTeam: data.player?.team || '',
    type: data.type,
    freeSquare: data.FreeSquare
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
  };
};
