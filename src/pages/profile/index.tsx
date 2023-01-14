import React from 'react';
import ProfileContainer from '~/containers/ProfileContainer';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';

const Profile = () => {
  return (
    <LayoutContainer>
      <div className={'flex w-full'}>
        <ProfileContainer />
      </div>
    </LayoutContainer>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
