import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ManageAmountAvailableToWithdrawPage from '~/pages/admin/withdrawable';

export default function PartnerManageAmountAvailableToWithdrawPage() {
  return <ManageAmountAvailableToWithdrawPage />;
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
