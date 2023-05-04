import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ManageAmountAvailableToWithdrawContainer from '~/containers/Admin/ManageUserWithrawablesContainer/ManageAmountAvailableToWithdrawContainer';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function ManageAmountAvailableToWithdrawPage() {
  return (
    <AdminLayoutContainer>
      <ManageAmountAvailableToWithdrawContainer />
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
