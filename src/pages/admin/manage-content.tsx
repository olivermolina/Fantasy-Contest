import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { ManageBannersContainer } from '~/containers/Admin/ManageContentsContainer.tsx/ManageBannersContainers';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function ManageUsersPage() {
  return (
    <AdminLayoutContainer>
      <ManageBannersContainer />
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
