import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import AdminWeeklyBalanceContainer from '~/containers/Admin/FiguresWeeklyBalance/WeeklyBalanceContainer';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

const WeeklyBalancePage = () => {
  return (
    <AdminLayoutContainer>
      <AdminWeeklyBalanceContainer />
    </AdminLayoutContainer>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');

export default WeeklyBalancePage;
