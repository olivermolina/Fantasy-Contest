import React from 'react';
import Icons from '~/components/Icons/Icons';
import { AvatarCircle } from '~/components';
import { ProfileMenu } from '~/components/Profile';
import { SettingsItemMenuProps } from '~/components/Profile/ProfileMenu/ProfileMenu';
import { UrlPaths } from '~/constants/UrlPaths';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import classNames from 'classnames';

export interface ProfileUser {
  username: string;
  image: string;
}

interface Props {
  activeMenu?: SettingsItemMenuProps | null;
  menus: SettingsItemMenuProps[];
  legalMenus: SettingsItemMenuProps[];
  user: ProfileUser;
  children?: JSX.Element;

  onSelectCallback(key: SettingsItemMenuProps | null): void;

  isLoading: boolean;
}

export const ProfileLayout = (props: Props) => {
  const router = useRouter();
  const isBaseProfileUrl = router?.pathname === UrlPaths.Profile;
  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-secondary">
      <div className="relative h-fit content-center bg-secondary items-center lg:hidden">
        {!isBaseProfileUrl && (
          <button
            className="absolute lg:hidden py-2.5 px-2 ml-4 top-2 text-primary text-sm font-medium bg-[#1A395B] rounded-lg border border-slate-500 hover:bg-light hover:border-white hover:text-secondary"
            type="button"
            onClick={() =>
              props.onSelectCallback({
                key: UrlPaths.Profile,
                label: '',
              })
            }
          >
            <Icons.ChevronLeft className={'h-6 w-6 stroke-white'} />
          </button>
        )}
        <div
          className={
            'flex flex-col content-center items-center p-4 gap-4 text-white '
          }
        >
          <p className="font-bold text-lg">
            {props.activeMenu?.label ?? `@${props.user?.username}`}
          </p>
          {isBaseProfileUrl && (
            <>
              <button
                type={'button'}
                className="relative rounded-full p-0.5 bg-white"
              >
                <div
                  className="absolute top-0 justify-center rounded-full p-1 bg-white"
                  style={{ right: 0 }}
                >
                  <Icons.Camera className="h-6 w-6 text-primary " />
                </div>
                <AvatarCircle
                  imgSrc={props.user?.image}
                  height={75}
                  width={75}
                />
              </button>
              <button
                className={
                  'flex flex-row items-center justify-center rounded-full bg-[#0057D4] p-2 text-sm'
                }
                onClick={() => router.push(UrlPaths.ProfileDetails)}
              >
                Profile Details
                <Icons.ChevronRight
                  className={'h-6 w-6 text-white font-semi-bold'}
                />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex bg-inherit w-full h-full p-2 lg:p-4">
        <div
          className={`lg:p-4 ${
            !isBaseProfileUrl ? 'hidden lg:flex lg:w-72' : ' w-full lg:w-72'
          }`}
        >
          <div className={'flex flex-col'}>
            <div>
              <p
                className={classNames(
                  'font-semibold bg-[#1A487F] text-white py-1 px-2 text-xs',
                )}
              >
                ACCOUNT
              </p>
              <ProfileMenu
                menus={props.menus}
                onSelectCallback={props.onSelectCallback}
                activeMenu={props.activeMenu}
              />
            </div>

            <div className="mt-4">
              <p
                className={
                  'font-semibold bg-[#1A487F] text-white py-1 px-2 text-xs'
                }
              >
                LEGAL
              </p>
              <ProfileMenu
                menus={props.legalMenus}
                onSelectCallback={props.onSelectCallback}
                activeMenu={props.activeMenu}
              />
            </div>
          </div>
        </div>
        {!isBaseProfileUrl && (
          <div className={'w-full h-full text-white'}>
            {props.isLoading ? <Skeleton /> : props.children}
          </div>
        )}
      </div>
    </div>
  );
};
