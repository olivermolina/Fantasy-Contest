import { NextPageWithLayout } from '../_app';
import { GetServerSideProps } from 'next';
import LeaderboardContainer from '~/containers/LeaderboardContainer/LeaderboardContainer';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { TabPanel } from '~/components';
import ContestsContainer from '~/containers/ContestsContainer/ContestsContainer';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import requestIp from 'request-ip';

const IndexPage: NextPageWithLayout = () => {
  return (
    <LayoutContainer>
      <div className="flex flex-col pt-3 w-full">
        <TabPanel
          variant="rounded"
          tabs={[
            {
              tabId: 1,
              title: 'CONTESTS',
            },
            {
              tabId: 2,
              title: 'LEADERBOARDS',
            },
          ]}
          tabsContent={[
            {
              tabId: 1,
              content: <ContestsContainer />,
            },
            {
              tabId: 2,
              content: <LeaderboardContainer />,
            },
          ]}
        />
      </div>
    </LayoutContainer>
  );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const { req } = context;
    const clientIp = requestIp.getClientIp(req);
    return {
      props: { clientIp },
    };
  },
);
