import React from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ResponsibleGaming from '~/components/ResponsibleGaming/ResponsibleGaming';
import ProfileContainer from '~/containers/ProfileContainer';

const ProfileResponsibleGaming = () => {
  return (
    <LayoutContainer>
      <div className={'flex w-full'}>
        <ProfileContainer>
          <ResponsibleGaming />
        </ProfileContainer>
      </div>
    </LayoutContainer>
  );
};

export default ProfileResponsibleGaming;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
