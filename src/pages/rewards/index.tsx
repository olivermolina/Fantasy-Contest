import { NextPageWithLayout } from '../_app';
import { GetServerSideProps } from 'next';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import RewardContainer from '~/containers/RewardContainer';

const RewardsPage: NextPageWithLayout = () => {
  return (
    <LayoutContainer>
      <RewardContainer />
    </LayoutContainer>
  );
};

export default RewardsPage;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
