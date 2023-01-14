import React from 'react';
import Icons from '~/components/Icons/Icons';
import { AvatarCircle } from '~/components';
import { ProfileMenu } from '~/components/Profile';
import { SettingsItemMenuProps } from '~/components/Profile/ProfileMenu/ProfileMenu';
import { UrlPaths } from '~/constants/UrlPaths';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';

export interface ProfileUser {
  username: string;
  image: string;
}

interface Props {
  activeMenu?: SettingsItemMenuProps | null;
  menus: SettingsItemMenuProps[];
  user: ProfileUser;
  children?: JSX.Element;

  onSelectCallback(key: SettingsItemMenuProps | null): void;

  isLoading: boolean;
}

export const ProfileLayout = (props: Props) => {
  const router = useRouter();
  const isBaseProfileUrl = router?.pathname === UrlPaths.Profile;
  return (
    <div className="flex flex-col lg:flex-row h-full w-full">
      <div className="relative h-fit content-center items-center lg:hidden">
        {!isBaseProfileUrl && (
          <button
            className="absolute lg:hidden py-2.5 px-2 ml-4 top-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
            type="button"
            onClick={() =>
              props.onSelectCallback({
                key: UrlPaths.Profile,
                label: '',
              })
            }
          >
            <Icons.ChevronLeft className={'h-6 w-6'} />
          </button>
        )}
        <div
          className={
            'flex flex-col content-center items-center bg-gray-100 p-4 gap-4 '
          }
        >
          <p className="font-bold text-lg">
            {props.activeMenu?.label || `@${props.user?.username}`}
          </p>
          {isBaseProfileUrl && (
            <button
              type={'button'}
              className="relative rounded-full p-2 bg-white"
            >
              <div
                className="absolute top-0 justify-center rounded-full p-1 bg-white"
                style={{ right: 0 }}
              >
                <Icons.Camera className="h-6 w-6 text-black" />
              </div>
              <AvatarCircle imgSrc={props.user?.image} height={75} width={75} />
            </button>
          )}
        </div>
      </div>
      <div className="flex bg-inherit w-full">
        <div
          className={`lg:p-4 ${
            !isBaseProfileUrl ? 'hidden lg:flex lg:w-72' : ' w-full lg:w-72'
          }`}
        >
          <ProfileMenu
            menus={props.menus}
            onSelectCallback={props.onSelectCallback}
            activeMenu={props.activeMenu}
          />
        </div>
        {!isBaseProfileUrl && (
          <div className={'w-full'}>
            {props.isLoading ? <Skeleton /> : props.children}
          </div>
        )}
      </div>
    </div>
  );
};
