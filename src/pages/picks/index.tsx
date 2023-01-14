import React from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import PicksContainer from '~/containers/Picks/PicksContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';

const Picks = () => {
  return (
    <LayoutContainer>
      <div className="grid h-full w-full p-2 bg-gray-100">
        <PicksContainer />
      </div>
    </LayoutContainer>
  );
};

export default Picks;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
