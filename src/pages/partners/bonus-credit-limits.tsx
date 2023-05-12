import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import AdminBonusCreditLimit from '~/pages/admin/bonus-credit-limits';

export default function PartnersBonusCreditLimit() {
  return <AdminBonusCreditLimit />;
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
