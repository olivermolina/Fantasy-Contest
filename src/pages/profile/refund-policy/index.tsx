import React from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ProfileContainer from '~/containers/ProfileContainer';
import RefundPolicy from '~/components/RefundPolicy/RefundPolicy';

const ProfileRefundPolicy = () => {
  return (
    <LayoutContainer>
      <div className={'flex w-full'}>
        <ProfileContainer>
          <RefundPolicy />
        </ProfileContainer>
      </div>
    </LayoutContainer>
  );
};

export default ProfileRefundPolicy;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
