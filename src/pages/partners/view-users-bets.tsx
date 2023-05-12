import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ViewUsersBetsPage from '~/pages/admin/view-users-bets';

export default function BetsPage() {
  return <ViewUsersBetsPage />;
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
