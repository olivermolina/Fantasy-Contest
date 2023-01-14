import React from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import ProfileContainer from '~/containers/ProfileContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';

const Settings = () => {
  return (
    <LayoutContainer>
      <div className={'flex w-full'}>
        <ProfileContainer>
          <div>Settings</div>
        </ProfileContainer>
      </div>
    </LayoutContainer>
  );
};

export default Settings;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
