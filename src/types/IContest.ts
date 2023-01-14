import { IBaseModel } from './IBaseModel';
import { Media } from './ISubmodels';
import { IUser } from './IUser';
import { IWallet } from './IWallet';

export interface IContest extends IBaseModel {
  name: string;
  description: string;
  wallets: IWallet[];
  contestants: (IUser | number)[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  image: Media;
}
