import React from 'react';
import { ProfileDetails } from '~/components/Profile';
import { useAppSelector } from '~/state/hooks';

const ProfileDetailsContainer = () => {
  const userDetails = useAppSelector((state) => state.profile.userDetails);
  return <ProfileDetails {...userDetails} />;
};

export default ProfileDetailsContainer;
