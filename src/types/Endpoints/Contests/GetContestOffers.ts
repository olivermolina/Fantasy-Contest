import * as StatNames from '~/server/routers/IStatNames';
import { IContest } from '../../IContest';
import { IOffer } from '../../IOffer';

export type Match = {
  name: string;
  spread: {
    value: number;
    odds: number;
  };
  total: {
    value: number;
    odds: number;
  };
  moneyline: {
    value: number;
    odds: number;
  };
};

type Filters = 'straight' | 'parlay' | 'teaser';

export type FantasyOffer = {
  marketId: string;
  selId: number;
  league: string;
  matchTime: string;
  odds: number;
  id: string;
  /**
   * i.e. https://api.lockspread.com/asset/img-200x200.png
   */
  playerPhotoURL: string;
  /**
   * i.e. "Passing Yards"
   */
  statName: StatNames.all;
  /**
   * The total number for O/U of the stat. i.e. 50 passing yards O/U
   */
  total: number;
  /**
   * i.e. LAR @ DEN
   */
  matchName: string;
  /**
   * i.e. Patrick Mahomes
   */
  playerName: string;
  /**
   * i.e. ['QB','KC']
   */
  tags: string[];
  /**
   * i.e. QB
   */
  playerPosition: string;
  /**
   * i.e. KC
   */
  playerTeam: string;
  /**
   * Market type
   */
  type: string;
};

export type GetContestOffers = {
  input: {
    id?: number;
    league?: IOffer['league'];
  };
  output:
    | (Pick<IContest, 'name' | 'id' | 'startDate' | 'endDate' | 'isActive'> &
        (
          | {
              filters: Filters[];
              offers: {
                id: number;
                away: Match;
                home: Match;
                matchTime: string;
              }[];
              type: 'match';
            }
          | {
              filters: StatNames.all[];
              offers: FantasyOffer[];
              type: 'picks';
            }
        ))
    | {
        status: 'NOT_ENROLLED';
        message: 'This user is not enrolled in any contests.';
      };
};
