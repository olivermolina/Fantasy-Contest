import { IBaseModel } from './IBaseModel';
import { IContest } from './IContest';
import { IUser } from './IUser';

export interface IWallet extends IBaseModel {
  contest: IContest | number;
  owner: IUser | number;
  balance: number;
}
