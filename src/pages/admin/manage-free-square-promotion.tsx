import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { ManageFreeSquarePromotionContainer } from '~/containers/Admin/ManageFreeSquarePromotionContainer/ManageFreeSquarePromotionContainer';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function ManageFreeSquarePromotionPage() {
  return (
    <AdminLayoutContainer>
      <ManageFreeSquarePromotionContainer />
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
