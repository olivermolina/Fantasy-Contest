import React from 'react';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useRouter } from 'next/router';
import { UrlPaths } from '~/constants/UrlPaths';

const breadcrumbNameMap: { [key: string]: string } = {
  [UrlPaths.AdminOffer]: 'Offers',
  [UrlPaths.AdminPendingBets]: 'Settle Pending Picks',
  [UrlPaths.AdminUsersBalance]: 'Users Balance',
  [UrlPaths.AdminWeeklyBalance]: 'Weekly Balance',
  [UrlPaths.AdminPlayFreeBonusCredit]: 'Play Free Bonus Credit',
  [UrlPaths.AdminWithdrawable]: 'Manage Amount Available to Withdraw',
  [UrlPaths.AdminLineExposure]: 'Line Exposure',
  [UrlPaths.ManageWithdrawalOffer]: 'Manage Withdrawal Offer',
  [UrlPaths.SendSMS]: 'Send SMS',
  [UrlPaths.ManageAgentReferralCodes]: 'Manage Partner Referral Codes',
  [UrlPaths.PartnersReferralCodes]: 'Manage Partner Referral Codes',
  [UrlPaths.ManagePartnersPams]: 'Add/Edit Agents & PAMs',
  [UrlPaths.ManageUsers]: 'Add/Edit Users',
  [UrlPaths.AdminUserLimits]: 'Entry Limits',
};

export default function AdminBreadCrumb() {
  const { pathname } = useRouter();

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      className={'bg-gray-200 px-6 py-2'}
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
      {pathname !== UrlPaths.Admin && pathname !== UrlPaths.Partners && (
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href={pathname}
        >
          {breadcrumbNameMap[pathname] ||
            pathname
              .replace('/admin/', '')
              .replace('/partners/', '')
              .replace(/\b[a-z]/g, (x) => x.toUpperCase())
              .replaceAll('-', ' ')}
        </Link>
      )}
    </Breadcrumbs>
  );
}
