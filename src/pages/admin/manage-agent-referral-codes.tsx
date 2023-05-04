import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ManageAgentReferralCodesContainer from '~/containers/Admin/ManageAgentReferralCodesContainer/ManageAgentReferralCodesContainer';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function ManageUserAgentsPage() {
  return (
    <AdminLayoutContainer>
      <ManageAgentReferralCodesContainer />
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
