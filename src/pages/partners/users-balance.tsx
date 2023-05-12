import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import UsersBalancePage from '~/pages/admin/users-balance';

export default function PartnerUsersBalancePage() {
  return <UsersBalancePage />;
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
