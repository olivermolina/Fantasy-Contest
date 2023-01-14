import { IAccountData, IBet } from '.';

/**
 * Model definition for posts
 */
export interface IPosts {
  id: string;
  content?: string;
  likes: {
    userId: number;
    username: string;
    description: string;
    avatarImgSrcURL: string;
    isVerified: boolean;
    created_at: string;
  }[];
  owner?: IAccountData;
  comments: {
    userId: number;
    username: string;
    content: string;
    created_at: string;
  }[];
  bet?: IBet;
  isAdmin?: boolean;
}
