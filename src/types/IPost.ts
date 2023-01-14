import { IAccountData } from './IAccountData';
import { IBaseModel } from './IBaseModel';
import { IBet } from './IBet';

/**
 * Model definition for posts
 */
export interface IPost extends IBaseModel {
  id: number;
  content?: string;
  likes: {
    userId: number;
    username: string;
    created_at: string;
    description: string;
    avatarImgSrcURL: string;
    isVerified: boolean;
  }[];
  owner: IAccountData | number;
  comments: {
    commentId: string;
    userId: number;
    username: string;
    avatarSrc: string;
    content: string;
    created_at: string;
    isVerified: boolean;
    likes: {
      userId: number;
      username: string;
      created_at: string;
      description: string;
      avatarImgSrcURL: string;
      isVerified: boolean;
    }[];
  }[];
  bet?: IBet | number;
  isAdmin: boolean;
}
