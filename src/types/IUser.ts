import { IContest, IWallet } from '.';

export interface IUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  password: string;
  resetPasswordToken?: string;
  confirmationToken?: string;
  confirmed: boolean;
  blocked?: boolean;
  role: IRole | number;
  phone: string;
  accountData: IAccountData | number;
  organization?: string;
  created_by?: string;
  updated_by: IUserSnapshot;
  created_at: string;
  updated_at: string;
  wallets: IWallet[];
  contests: IContest[];
}

interface IUserSnapshot {
  id: number;
  firstname: string;
  lastname: string;
  username?: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  registrationToken?: string;
  isActive: boolean;
  blocked?: boolean;
}

interface IAccountData {
  id: number;
  balance: number;
  user: number;
  isVerified: boolean;
  description: string;
  published_at: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  avatar: IAvatar;
}

interface IAvatar {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats: IFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

interface IFormats {
  thumbnail: IThumbnail;
  large: IThumbnail;
  medium: IThumbnail;
  small: IThumbnail;
}

interface IThumbnail {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

interface IRole {
  id: number;
  name: string;
  description: string;
  type: string;
  created_by?: string;
  updated_by?: string;
}
