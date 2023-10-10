import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import AdminMonthlyUserConversionPage from '~/pages/admin/monthly-user-conversion';

export default function PartnersMonthlyUserConversionPage() {
  return <AdminMonthlyUserConversionPage />;
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
