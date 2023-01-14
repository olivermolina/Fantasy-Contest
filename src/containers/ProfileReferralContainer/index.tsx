import React from 'react';
import { Referral } from '~/components/Profile';
import { useAppSelector } from '~/state/hooks';

const ReferralContainer = () => {
  const { userDetails } = useAppSelector((state) => state.profile);
  return <Referral referralCode={userDetails?.username || ''} />;
};

export default ReferralContainer;
