import React from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import requestIp from 'request-ip';
import ProfileContainer from '~/containers/ProfileContainer';
import AccountDepositLazyContainer from '~/containers/ProfileAccountDepositContainer';

interface Props {
  clientIp: string;
}

const AccountDeposit = (props: Props) => {
  return (
    <LayoutContainer>
      <div className={'flex w-full'}>
        <ProfileContainer>
          <AccountDepositLazyContainer {...props} />
        </ProfileContainer>
      </div>
    </LayoutContainer>
  );
};

export default AccountDeposit;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const { req } = context;
    const clientIp = requestIp.getClientIp(req);
    return {
      props: { clientIp },
    };
  },
);
