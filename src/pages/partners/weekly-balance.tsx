import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import WeeklyBalancePage from '~/pages/admin/weekly-balance';

const PartnerWeeklyBalancePage = () => {
  return <WeeklyBalancePage />;
};

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');

export default PartnerWeeklyBalancePage;
