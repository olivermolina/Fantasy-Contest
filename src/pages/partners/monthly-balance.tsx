import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import MonthlyBalancePage from '~/pages/admin/monthly-balance';

const PartnerMonthlyBalancePage = () => {
  return <MonthlyBalancePage />;
};

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');

export default PartnerMonthlyBalancePage;
