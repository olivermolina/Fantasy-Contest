import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import AdminLayout from '~/components/Admin/AdminLayout';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import { UrlPaths } from '~/constants/UrlPaths';
import AdminContainer from '~/containers/AdminContainer';

const AdminPage = () => {
  return (
    <>
      <ChangeRouteLoadingContainer />
      <AdminLayout>
        <AdminContainer />
      </AdminLayout>
    </>
  );
};

export default AdminPage;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    redirect: {
      permanent: false,
      destination: UrlPaths.AdminOffer,
    },
  };
});
