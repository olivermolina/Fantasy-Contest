import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { PendingBetsManagementContainer } from '~/containers/Admin/PendingBetsManagementContainer/PendingBetsManagementContainer';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function PendingPage() {
  return (
    <AdminLayoutContainer>
      <PendingBetsManagementContainer />
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
