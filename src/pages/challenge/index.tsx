import CartContainer from '~/containers/CartContainer/CartContainer';
import ContestPickerContainer from '~/containers/ContestContainer/ContestPickerContainer';
import MatchPickerTableContainer from '~/containers/MatchPickerTableContainer/MatchPickerTableContainer';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ContestPickerCategoryContainer from '~/containers/ContestPickerCategoryContainer/ContestPickerCategoryContainer';
import React from 'react';
import requestIp from 'request-ip';
import ChallengeHeaderContainer from '~/containers/ChallengeHeaderContainer/ChallengeHeaderContainer';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/routers/_app';
import { createContext } from '~/server/context';
import { trpcTransformer } from '~/utils/trpc';

interface Props {
  clientIp: string;
  query: GetServerSidePropsContext['query'];
}

const ChallengePage = (props: Props) => {
  return (
    <LayoutContainer query={props.query}>
      <div className={'flex flex-nowrap'}>
        <div className={'min-w-md hidden lg:block'}>
          <CartContainer {...props} isChallengePage />
        </div>
        <div className={'w-full'}>
          <ChallengeHeaderContainer />
          <ContestPickerContainer />
          <ContestPickerCategoryContainer />
          <MatchPickerTableContainer />
        </div>
      </div>
    </LayoutContainer>
  );
};

export default ChallengePage;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const { req } = context;
    const clientIp = requestIp.getClientIp(req);

    const helpers = createServerSideHelpers({
      router: appRouter,
      ctx: await createContext({
        req: context.req as NextApiRequest,
        res: context.res as NextApiResponse,
      }),
      transformer: trpcTransformer,
    });

    await helpers.contest.getLeagueFantasyOffersCount.prefetch();

    return {
      props: {
        dehydratedState: helpers.dehydrate(),
        clientIp,
        query: context.query,
      },
    };
  },
);
