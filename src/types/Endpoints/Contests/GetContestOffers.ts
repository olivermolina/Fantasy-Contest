import * as StatNames from '~/server/routers/IStatNames';
import { IContest } from '../../IContest';
import { IOffer } from '../../IOffer';
import type { FantasyCardFreeSquareProps } from '~/components/FantasyPicker/FantasyCard';

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
  matchDateTime: Date;
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
   * i.e. 1234
   */
  playerTeamId: string;
  /**
   * Market type
   */
  type: string;
  /**
   * Over odds
   * @example 100
   */
  overOdds: number;
  /**
   * Under odds
   * @example -100
   */
  underOdds: number;
  /**
   * The ID of the player
   * @example 43122
   */
  playerId: string;
  /**
   * The Free Square object
   */
  freeSquare: FantasyCardFreeSquareProps | null;

  /**
   * The original total number for O/U of the stat. i.e. 50 passing yards O/U
   */
  originalTotal: number;
  /**
   * Original Over odds
   * @example 100
   */
  originalOverOdds: number;
  /**
   * Original Under odds
   * @example -100
   */
  originalUnderOdds: number;
  /**
   * The adjusted total number for O/U of the stat. i.e. 50 passing yards O/U
   */
  adjustedTotal?: number | null;
  /**
   * Adjusted Over odds
   * @example 100
   */
  adjustedOverOdds?: number | null;
  /**
   * Adjusted Under odds
   * @example -100
   */
  adjustedUnderOdds?: number | null;
  /**
   * To show if the offer is active or not
   */
  active: boolean;
  /**
   * The event name of the offer
   */
  eventName?: string;
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
