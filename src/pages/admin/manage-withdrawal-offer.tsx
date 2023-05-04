import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ManageWithdrawalOfferContainer from '~/containers/Admin/ManageWithdrawalOffer/ManageWithdrawalOfferContainer';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function ManageWithdrawalOffer() {
  return (
    <AdminLayoutContainer>
      <ManageWithdrawalOfferContainer />
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
