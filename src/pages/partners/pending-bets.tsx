import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import PendingPage from '~/pages/admin/pending-bets';

export default function PartnerPendingPage() {
  return <PendingPage />;
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
