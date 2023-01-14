import React from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import ProfileContainer from '~/containers/ProfileContainer';
import ProfileReferralContainer from '~/containers/ProfileReferralContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';

const ReferralPage = () => {
  return (
    <LayoutContainer>
      <div className={'flex w-full'}>
        <ProfileContainer>
          <ProfileReferralContainer />
        </ProfileContainer>
      </div>
    </LayoutContainer>
  );
};

export default ReferralPage;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
