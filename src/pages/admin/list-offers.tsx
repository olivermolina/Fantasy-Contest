import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ListOffersContainer from '~/containers/Admin/ListOffersContainer/ListOffersContainer';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function ListOffers() {
  return (
    <AdminLayoutContainer>
      <ListOffersContainer />
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
