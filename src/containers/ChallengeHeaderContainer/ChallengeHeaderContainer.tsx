import React from 'react';
import ChallengeHeader from '~/components/Challenge/ChallengeHeader';
import { useAppSelector } from '~/state/hooks';

const ChallengeHeaderContainer = () => {
  const challengePromoMessage = useAppSelector(
    (state) => state.appSettings.CHALLENGE_PROMO_MESSAGE,
  );

  return <ChallengeHeader challengePromoMessage={challengePromoMessage} />;
};

export default ChallengeHeaderContainer;
