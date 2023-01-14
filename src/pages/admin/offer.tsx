import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import AdminOfferContainer from '~/containers/AdminOfferContainer';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import AdminLayout from '~/components/Admin/AdminLayout';
import AdminContainer from '~/containers/AdminContainer';

const AdminPage = () => {
  return (
    <>
      <ChangeRouteLoadingContainer />
      <AdminLayout>
        <AdminContainer>
          <AdminOfferContainer />
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
