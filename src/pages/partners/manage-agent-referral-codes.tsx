import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ManageUserAgentsPage from '~/pages/admin/manage-agent-referral-codes';

export default function ReferralUserAgentsPage() {
  return <ManageUserAgentsPage />;
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
