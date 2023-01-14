import { IContest, IUser } from '.';
import { IAccountData } from './IAccountData';
import { IBetLeg } from './IBetLeg';
import { IPost } from './IPost';

export type TChallengeState = 'pending' | 'accepted' | 'declined';

/**
 * Model definition for bets
 */
export interface IBet {
  id: number;
  stake: number;
  user: IUser | number;
  payout: number;
  post: IPost | number;
  challenger: IAccountData | number;
  challengerUsername: string;
  contest?: IContest | number;
  challengeState: TChallengeState;
  status: 'pending' | 'win' | 'loss' | 'push';
  odds: number;
  legs: IBetLeg[];
  type?: 'Teaser';
}
