import React, { useEffect } from 'react';
import { Layout } from '~/components/Layout';
import { ToastContainer } from 'react-toastify';
import { useQueryParams } from '~/hooks/useQueryParams';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import { UrlPaths } from '~/constants/UrlPaths';
import { useAppSelector } from '~/state/hooks';
import { selectAllBets } from '~/state/bets';
import { ContestWagerType } from '@prisma/client';
import ContestDetailContainer from '../ContestDetailContainer/ContestDetailContainer';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import { Header } from '~/components';
import DeviceLocationContainer from '~/containers/DeviceLocationContainer';
import { GetServerSidePropsContext } from 'next';
import { useDispatch } from 'react-redux';
import { setCategoryBgColor } from '~/state/ui';

type Props = {
  children: any;
  query?: GetServerSidePropsContext['query'];
};

const LayoutContainer: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useQueryParams({ query: props.query });
  const cartItemsCount = useAppSelector((state) => selectAllBets(state).length);
  const cartStake = useAppSelector((state) =>
    selectAllBets(state).reduce((acc, cur) => acc + cur.stake, 0),
  );
  const cartPayout = useAppSelector((state) =>
    selectAllBets(state).reduce((acc, curr) => acc + 0, 0),
  );
  const entry = useAppSelector((state) => selectAllBets(state)[0]);

  const selectedContest = useAppSelector((state) => state.ui.selectedContest);
  const contestModal = useAppSelector(
    (state) => state.ui.activeContestDetailModal,
  );
  const contestCategory = useAppSelector(
    (state) => state.ui.selectedContestCategory,
  );

  const { data, isLoading } = trpc.contest.getLeagueFantasyOffersCount.useQuery(
    undefined,
    {
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    },
  );

  const userDetails = useAppSelector((state) => state.profile.userDetails);

  const { data: userTotalBalance, refetch } =
    trpc.user.userTotalBalance.useQuery({ userId: userDetails?.id });

  const tokenCount = 0;

  const handleSetCategoryBgColor = (bgColor: string) => {
    dispatch(setCategoryBgColor(bgColor));
  };

  useEffect(() => {
    refetch();
  }, [cartStake, contestModal]);

  useEffect(() => {
    if (data) {
      // Get the default nav league where offers & markets are available
      const defaultLeague = data?.find((league) => league.count > 0);
      params.setParam('league', defaultLeague?.league);
    }
  }, [data]);

  return (
    <>
      <Header />
      <DeviceLocationContainer />
      <ChangeRouteLoadingContainer />
      <Layout
        query={props.query}
        onClickCartDetails={() => {
          router.push(UrlPaths.Cart);
        }}
        cartItemsCount={cartItemsCount}
        cartStake={cartStake}
        cartPotentialPayout={cartPayout}
        userCashAmount={Number(userTotalBalance?.totalAmount) || 0}
        currentContestTokenCount={tokenCount}
        onClickAddUserCash={() => {
          router.push(UrlPaths.ProfileAccountDeposit);
        }}
        // Only show in challenge page
        showSubNav={UrlPaths.Challenge.toString() === router?.pathname}
        showTokenCount={selectedContest?.wagerType === ContestWagerType.TOKEN}
        showMobileCart={UrlPaths.Cart.toString() !== router?.pathname}
        playersSelected={entry?.legs.length || 0}
        contestCategory={contestCategory}
        leagueFantasyOffersCount={data || []}
        handleSetCategoryBgColor={handleSetCategoryBgColor}
        isLoading={isLoading}
      >
        {props.children}
      </Layout>
      <ContestDetailContainer />
      <ToastContainer />
    </>
  );
};

export default LayoutContainer;
