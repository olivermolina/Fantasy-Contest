import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import PlayFreeBonusCreditPage from '~/pages/admin/play-free';

export default function PartnersPlayFreeBonusCreditPage() {
  return <PlayFreeBonusCreditPage />;
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
