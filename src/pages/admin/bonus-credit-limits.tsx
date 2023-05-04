import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import BonusCreditLimitsContainer from '~/containers/Admin/BonusCreditLimitsContainer/BonusCreditLimitsContainer';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function AdminBonusCreditLimit() {
  return (
    <AdminLayoutContainer>
      <BonusCreditLimitsContainer />
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
