import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { ManagePartnersPamsContainer } from '~/containers/Admin/ManagePartnersPamsContainer/ManagePartnersPamsContainer';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function ManagePartnersPamsPage() {
  return (
    <AdminLayoutContainer>
      <ManagePartnersPamsContainer />
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
