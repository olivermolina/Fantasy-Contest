import { Market, Offer, Player } from '@prisma/client';
import { FantasyOffer } from '~/types';
import * as StatNames from '~/server/routers/IStatNames';
import dayjs from 'dayjs';
import { EntryDatetimeFormat } from '~/constants/EntryDatetimeFormat';

export const mapData = (
  data: Market & {
    offer: Offer | null;
    player: Player | null;
  },
): FantasyOffer => {
  return {
    id: data.id,
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
    matchTime: dayjs(`${data.offer!.gamedate} ${data.offer!.gametime}`).format(
      EntryDatetimeFormat,
    ),
    odds: 100,
    playerPosition: data.player?.position || '',
    playerTeam: data.player?.team || '',
    type: data.type,
  };
};
