import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import PlayFreeBonusCreditContainer from '~/containers/Admin/PlayFreeBonusCreditContainer/PlayFreeBonusCreditContainer';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function PlayFreeBonusCreditContainerPage() {
  return (
    <AdminLayoutContainer>
      <PlayFreeBonusCreditContainer />
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
