import { NextPageWithLayout } from '../_app';
import { supabase } from '~/utils/supabaseClient';
import { GetServerSideProps } from 'next';
import LeaderboardContainer from '~/containers/LeaderboardContainer/LeaderboardContainer';
import { UrlPaths } from '~/constants/UrlPaths';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { TabPanel } from '~/components';
import ContestsContainer from '~/containers/ContestsContainer/ContestsContainer';

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await supabase.auth.api.getUserByCookie(ctx.req, ctx.res);
  if (!user.user) {
    return {
      redirect: {
        permanent: false,
        destination: UrlPaths.Login,
      },
    };
  }
  return {
    props: {},
  };
};
