import { IUser } from './IUser';

export interface Media {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats: Record<
    'small' | 'medium' | 'large' | 'thumbnail',
    {
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
  >;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: string;
  created_at: string;
  updated_at: string;
  created_by: IUser | number;
  updated_by: IUser | number;
}
