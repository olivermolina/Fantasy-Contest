import React from 'react';
import {
  BetStakeType,
  ContestCategory,
  ContestWagerType,
} from '@prisma/client';
import { InsuredPayout } from '~/utils/calculateInsuredPayout';

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
}
