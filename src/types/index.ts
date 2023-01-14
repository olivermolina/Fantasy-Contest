/* eslint-disable @typescript-eslint/no-namespace */
import { ParameterizedContext } from 'koa';
export * from './Endpoints';
import { IAccountData } from './IAccountData';
import { IBaseModel } from './IBaseModel';
import { IBet, TChallengeState } from './IBet';
import { IBetLeg } from './IBetLeg';
import { IContest } from './IContest';
import { IOffer } from './IOffer';
import { IPost } from './IPost';
import { IUser } from './IUser';

type BetTypes = 'Teaser';

export namespace LockSpread {
  export type Context<
    BodyT = unknown,
    ParamsT = unknown,
    QueryT = unknown,
  > = ParameterizedContext<{
    user: UserContext;
  }> & { request: { body: BodyT } } & { params: ParamsT; query: QueryT };
  interface Owner {
    userId: number;
    username: string;
    avatarSrc: string;
    isVerified: boolean;
  }
  export interface UserContext {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    resetPasswordToken?: any;
    registrationToken?: any;
    isActive: boolean;
    blocked?: any;
    preferedLanguage?: any;
    accountData: number;
    roles: Role[];
  }

  interface Role {
    id: number;
    name: string;
    code: string;
    description: string;
    created_at: Date;
    updated_at: Date;
  }

  export namespace Requests {
    export interface AcceptChallenge {
      id: IBet['id'];
    }
    export interface CounterChallenge {
      /**
       * The ID of the bet you want to counter offer on.
       */
      id: IBet['id'];
      /**
       * The new amount you'd like to counter offer.
       */
      stake: IBet['stake'];
    }
    interface CreateBaseBet {
      stake: number;
      /**
       * This is the USER id. Not the account data one.
       */
      challenger?: number;
      contest?: number;
    }
    export interface CreateBet {
      offerId: number;
      type: IBetLeg['type'];
    }

    export interface CreateParlay extends CreateBaseBet {
      legs: CreateBet[];
      type?: BetTypes;
    }
    export interface CreatePost {
      content: string;
    }
    export interface LikeComment {
      params: {
        pid: string;
        cid: string;
      };
    }
  }

  export namespace Responses {
    export type GetContest = Promise<
      {
        wallets: any[];
        name: string;
        description: string;
        contestants: (number | IUser)[];
        startDate: string;
        endDate: string;
        isActive: boolean;
        image: any;
        id: number;
        created_at: string;
        updated_at: string;
      }[]
    >;

    interface SanitizedBet extends IBaseModel {
      id: number;
      stake: number;
      user: IUser;
      payout: number;
      post: IPost;
      challenger: IAccountData;
      challengerUsername: string;
      contest?: IContest;
      challengeState: TChallengeState;
      status: 'pending' | 'win' | 'loss' | 'push';
      odds: number;
      legs: (IBetLeg & { offer: IOffer })[];
    }

    export type GetBets = SanitizedBet[];

    export type AcceptChallenge = SanitizedBet;
    export interface CreatePost {
      id: number;
      content: string;
      likes: IPost['likes'];
      owner: Owner;
      comments: IPost['comments'];
      bet?: IBet;
      isAdmin: boolean;
      created_at: string;
      updated_at: string;
    }
    export type PostsFind = (Omit<IPost, 'owner'> & {
      owner: Owner;
    })[];
    type TChallenge = Omit<IBet, 'challenger'> & {
      challenger: {
        id: number;
        username: string;
        isVerified: boolean;
      };
    };
    export interface Me {
      id: number;
      balance: number;
      user: {
        id: number;
        username: string;
        isVerified: boolean;
        email: string;
        organization: string;
      };
      avatarImgSrcURL: string;
      followers: IAccountData['followers'];
      following: IAccountData['following'];
      isVerified: boolean;
      description: string;
      created_at: string;
      updated_at: string;
      challenges: TChallenge[];
    }

    export interface CreateParlay {
      balance: number;
    }
    export interface CreateBet {
      balance: number;
    }

    export interface MeChallenges {
      bets: TChallenge[];
    }
  }
}

export * from './IAccountData';
export * from './IBet';
export * from './IOffer';
export * from './IPost';
export * from './ISportsPageFeedLimits';
export * from './IContest';
export * from './IWallet';
export * from './IUser';
export * from './IBetLeg';
