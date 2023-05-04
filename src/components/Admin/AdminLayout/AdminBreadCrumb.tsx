import React from 'react';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useRouter } from 'next/router';
import { UrlPaths } from '~/constants/UrlPaths';

const breadcrumbNameMap: { [key: string]: string } = {
  [UrlPaths.AdminOffer]: 'Offers',
  [UrlPaths.AdminPendingBets]: 'Delete picks',
  [UrlPaths.AdminUsersBalance]: 'Users Balance',
  [UrlPaths.AdminWeeklyBalance]: 'Weekly Balance',
  [UrlPaths.AdminPlayFreeBonusCredit]: 'Play Free Bonus Credit',
  [UrlPaths.AdminWithdrawable]: 'Manage Amount Available to Withdraw',
  [UrlPaths.AdminLineExposure]: 'Line Exposure',
  [UrlPaths.ManageWithdrawalOffer]: 'Manage Withdrawal Offer',
  [UrlPaths.SendSMS]: 'Send SMS',
};

export default function AdminBreadCrumb() {
  const { pathname } = useRouter();

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      className={'bg-gray-200 p-2 my-2'}
      separator={<NavigateNextIcon fontSize="small" />}
    >
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href="/admin"
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      {pathname !== UrlPaths.Admin && (
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href={pathname}
        >
          {breadcrumbNameMap[pathname] ||
            pathname
              .replace('/admin/', '')
              .replace(/\b[a-z]/g, (x) => x.toUpperCase())
              .replaceAll('-', ' ')}
        </Link>
      )}
    </Breadcrumbs>
  );
}
