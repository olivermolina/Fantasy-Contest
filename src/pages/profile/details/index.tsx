import React from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import ProfileContainer from '~/containers/ProfileContainer';
import ProfileDetailsContainer from '~/containers/ProfileDetailsContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';

const ProfileDetails = () => {
  return (
    <LayoutContainer>
      <div className={'flex w-full'}>
        <ProfileContainer>
          <ProfileDetailsContainer />
        </ProfileContainer>
      </div>
    </LayoutContainer>
  );
};

export default ProfileDetails;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
