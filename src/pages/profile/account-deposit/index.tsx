import React, { Suspense } from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import requestIp from 'request-ip';
import ProfileContainer from '~/containers/ProfileContainer';
import { Skeleton } from '@mui/material';

const AccountDepositLazyContainer = dynamic(
  () => import('~/containers/ProfileAccountDepositContainer'),
  {
    suspense: true,
  },
);

interface Props {
  clientIp: string;
}

const AccountDeposit = (props: Props) => {
  return (
    <LayoutContainer>
      <div className={'flex w-full'}>
        <ProfileContainer>
          <Suspense
            fallback={
              <div>
                <Skeleton />
              </div>
            }
          >
            <AccountDepositLazyContainer {...props} />
          </Suspense>
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
