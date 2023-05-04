import React from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import ProfileContainer from '~/containers/ProfileContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ProfileTransactionHistoryContainer from '~/containers/ProfileTransactionHistoryContainer';

const ProfileWithdrawFunds = () => {
  return (
    <LayoutContainer>
      <ProfileContainer>
        <ProfileTransactionHistoryContainer />
      </ProfileContainer>
    </LayoutContainer>
  );
};

export default ProfileWithdrawFunds;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
