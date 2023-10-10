import React from 'react';
import {
  BetStakeType,
  ContestCategory,
  ContestWagerType,
} from '@prisma/client';
import { InsuredPayout } from '~/utils/calculatePayout';

type LegType = {
  id: string;
  league: string;
  matchTime: string;
  onClickDeleteCartItem: React.MouseEventHandler<HTMLButtonElement>;
  betName: string;
  betOdds: number;
  betType: string;
  awayTeamName: string;
  homeTeamName: string;
  statName: string;
  betOption: string;
  onClickMoreLess: (
    event: React.MouseEvent<HTMLElement>,
    value: 'away' | 'home' | 'over' | 'under',
  ) => void;
};

export interface ICartItemProps {
  id: string;

  onUpdateCartItem(id: string, value: number): void;

  legs: LegType[];
  stake: string;
  payout: string;
  insuredPayout: InsuredPayout;
  wagerType?: ContestWagerType;
  stakeType: BetStakeType;
  contestCategory: ContestCategory;

  onUpdateBetStakeType(stakeType: BetStakeType): void;

  /**
   * The minimum bet amount that the user is allowed to bet using the UI.
   */
  minBetAmount: number;
  /**
   * The maximum bet amount that the user is allowed to bet using the UI.
   */
  maxBetAmount: number;
  /**
   * User's free entry count
   */
  freeEntryCount: number;
  /**
   * Free entry stake amount
   */
  freeEntryStake?: number;
  /**
   * The app setting string value of Free Entry stake type options
   * @example 'ALL_IN, INSURED'
   */
  stakeTypeFreeEntry?: string;
}
