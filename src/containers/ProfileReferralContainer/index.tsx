import React from 'react';
import { Referral } from '~/components/Profile';
import { useAppSelector } from '~/state/hooks';

const ReferralContainer = () => {
  const { userDetails } = useAppSelector((state) => state.profile);
  const referralCustomText = useAppSelector(
    (state) => state.appSettings.REFERRAL_CUSTOM_TEXT,
  );
  return (
    <Referral
      referralCode={userDetails?.username || ''}
      referralCustomText={referralCustomText}
    />
  );
};

export default ReferralContainer;
