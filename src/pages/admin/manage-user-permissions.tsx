import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { ManageUserPermissionsContainer } from '~/containers/Admin/ManageUserPermissionsContainer/ManageUserPermissionsContainer';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function ManageUsersPage() {
  return (
    <AdminLayoutContainer>
      <ManageUserPermissionsContainer />
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
