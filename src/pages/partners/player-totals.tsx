import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import AdminPlayerTotalsPage from '~/pages/admin/player-totals';

export default function UsersBalancePage() {
  return <AdminPlayerTotalsPage />;
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
