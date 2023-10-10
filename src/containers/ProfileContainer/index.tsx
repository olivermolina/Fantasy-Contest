import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { SettingsItemMenuProps } from '~/components/Profile/ProfileMenu/ProfileMenu';
import { trpc } from '~/utils/trpc';
import Icons from '~/components/Icons/Icons';
import { UrlPaths } from '~/constants/UrlPaths';
import { ProfileLayout } from '~/components/Profile/ProfileLayout/ProfileLayout';
import { useAppDispatch } from '~/state/hooks';
import { setAppSettings, setUserDetails } from '~/state/profile';
import { UserType } from '@prisma/client';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface Props {
  children?: JSX.Element;
}

const MENUS = [
  {
    key: UrlPaths.ProfileAccountDeposit,
    label: 'Account Deposit',
    icon: <Icons.MoneyBillTransfer className={'h-6 ml-0.5'} />,
  },
  {
    key: UrlPaths.ProfileWithdrawFunds,
    label: 'Withdraw Funds',
    icon: <Icons.MoneyFromBracket className={'h-6 ml-0.5'} />,
  },
  {
    key: UrlPaths.ProfileDetails,
    label: 'Profile Details',
    icon: <Icons.User className={'h-8'} />,
  },
  {
    key: UrlPaths.ProfileTransactionHistory,
    label: 'Transaction History',
    icon: <Icons.RectangleHistory className={'h-6'} />,
  },
  {
    key: UrlPaths.ProfileReferral,
    label: 'My Referral Code',
    icon: <Icons.UserAdd className={'h-8'} />,
  },
  {
    key: UrlPaths.Partners,
    label: 'Partner Portal',
    icon: <Icons.Portal className={'h-8'} />,
  },
];
const LEGAL_MENUS = [
  {
    key: UrlPaths.ProfileResponsibleGaming,
    label: 'Responsible Gaming',
    icon: <Icons.FileContract className={'h-6 ml-1'} />,
  },
  {
    key: UrlPaths.ProfileRefundPolicy,
    label: 'Refund Policy',
    icon: <Icons.FileContract className={'h-6 ml-1'} />,
  },
  {
    key: 'logout',
    label: 'Log Out',
    icon: <Icons.Logout className={'h-8'} />,
  },
];

const ProfileContainer = (props: Props) => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeMenu, setActiveMenu] = useState<SettingsItemMenuProps | null>();
  const { data: appSettings, isLoading: appSettingsIsLoading } =
    trpc.appSettings.list.useQuery();

  const { data, isLoading } = trpc.user.userDetails.useQuery();

  const logoutMutation = trpc.user.logout.useMutation();

  const user = useMemo(
    () => ({
      id: data?.id || '',
      username: data?.username || '',
      email: data?.email || '',
      image: `https://eu.ui-avatars.com/api/?name=${data?.username}&size=250&color=fff&background=1A487F`,
      followers: 502,
      following: 300,
      showFollowers: false,
      isFirstDeposit: data?.isFirstDeposit,
      isAdmin: data?.isAdmin,
      firstname: data?.firstname || '',
      lastname: data?.lastname || '',
      address1: data?.address1 || '',
      address2: data?.address2 || '',
      city: data?.city || '',
      state: data?.state || '',
      postalCode: data?.postalCode || '',
      dob: data?.DOB?.toString() || '',
    }),
    [data],
  );
  const { pathname } = router;

  const onSelectCallback = async (
    newActiveMenu: SettingsItemMenuProps | null,
  ) => {
    if (newActiveMenu?.key === 'logout') {
      await logoutMutation.mutateAsync();
      await supabaseClient.auth.signOut();
      await router.push('/');
      return;
    }
    setActiveMenu(newActiveMenu);
    if (newActiveMenu && pathname !== newActiveMenu.key) {
      await router.push(newActiveMenu.key);
    }
  };

  useEffect(() => {
    dispatch(setUserDetails(user));
    if (appSettings) {
      dispatch(setAppSettings(appSettings.userAppSettings));
    }
  }, [user, appSettings]);

  useEffect(() => {
    const currentMenu = [...MENUS, ...LEGAL_MENUS].find(
      (menu) => menu.key === pathname,
    );
    if (currentMenu) setActiveMenu(currentMenu);
  }, [pathname]);

  const menus = useMemo(() => {
    if (data?.type !== UserType.AGENT) {
      return MENUS.filter((menu) => menu.key !== UrlPaths.Partners);
    }
    return MENUS;
  }, [data]);

  return (
    <ProfileLayout
      {...props}
      activeMenu={activeMenu}
      menus={menus}
      legalMenus={LEGAL_MENUS}
      user={user}
      onSelectCallback={onSelectCallback}
      isLoading={isLoading || appSettingsIsLoading}
    />
  );
};

export default ProfileContainer;
