import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';
import MonthlyBalanceContainer from '~/containers/Admin/FiguresMonthlyBalance/MonthlyBalanceContainer';

const MonthlyBalancePage = () => {
  return (
    <AdminLayoutContainer>
      <MonthlyBalanceContainer />
    </AdminLayoutContainer>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');

export default MonthlyBalancePage;
