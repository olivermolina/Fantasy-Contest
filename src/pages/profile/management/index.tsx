import React from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import requestIp from 'request-ip';
import ProfileManagementContainer from '~/containers/ProfileManagementContainer';
import ProfileContainer from '~/containers/ProfileContainer';

interface Props {
  clientIp: string;
}

const Management = (props: Props) => {
  return (
    <LayoutContainer>
      <div className={'flex w-full'}>
        <ProfileContainer>
          <ProfileManagementContainer />
        </ProfileContainer>
      </div>
    </LayoutContainer>
  );
};

export default Management;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const { req } = context;
    const clientIp = requestIp.getClientIp(req);
    return {
      props: { clientIp },
    };
  },
);
