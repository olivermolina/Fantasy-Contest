import { IUser } from '.';
import { IBaseModel } from './IBaseModel';
import { IBet } from './IBet';
import { IPost } from './IPost';

/**
 * Model definition for AccountData
 */
export interface IAccountData extends IBaseModel {
  id: number;
  balance: number;
  user: IUser | number;
  avatar?: any;
  followers: any[];
  following: any[];
  isVerified: boolean;
  description: string;
  posts: IPost[] | number[];
  challenges: IBet[] | number[];
}
