import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ViewPicksByUserPage from '~/pages/admin/view-picks-by-user';

export default function PartnerViewPicksByUserPage() {
  return <ViewPicksByUserPage />;
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
