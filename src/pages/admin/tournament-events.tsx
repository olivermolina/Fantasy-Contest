import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import TournamentEventContainer from '~/containers/Admin/TournamentEventContainer/TournamentEventContainer';

export default function AdminOfferPage() {
  return <TournamentEventContainer />;
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
