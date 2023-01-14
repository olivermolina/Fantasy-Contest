import React from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import ProfileContainer from '~/containers/ProfileContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ProfileWithdrawFundsContainer from '~/containers/ProfileWithdrawFundsContainer';
import requestIp from 'request-ip';

interface Props {
  clientIp: string;
}

const ProfileWithdrawFunds = (props: Props) => {
  return (
    <LayoutContainer>
      <div className={'flex w-full'}>
        <ProfileContainer>
          <ProfileWithdrawFundsContainer clientIp={props.clientIp} />
        </ProfileContainer>
      </div>
    </LayoutContainer>
  );
};

export default ProfileWithdrawFunds;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const { req } = context;
    const clientIp = requestIp.getClientIp(req);
    return {
      props: { clientIp },
    };
  },
);
