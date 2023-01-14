import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import AdminLayout from '~/components/Admin/AdminLayout';
import AdminUserManagementContainer from '~/containers/AdminUserManagementContainer';
import AdminContainer from '~/containers/AdminContainer';

const AdminPage = () => {
  return (
    <>
      <ChangeRouteLoadingContainer />
      <AdminLayout>
        <AdminContainer>
          <AdminUserManagementContainer />
        </AdminContainer>
      </AdminLayout>
    </>
  );
};

export default AdminPage;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
