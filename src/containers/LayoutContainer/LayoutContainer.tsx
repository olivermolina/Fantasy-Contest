import React, { useEffect } from 'react';
import { Layout } from '~/components/Layout';
import { ToastContainer } from 'react-toastify';
import { useQueryParams } from '~/hooks/useQueryParams';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import { UrlPaths } from '~/constants/UrlPaths';
import { useAppSelector } from '~/state/hooks';
import { selectAllBets } from '~/state/bets';
import { ContestWagerType, League } from '@prisma/client';
import ContestDetailContainer from '../ContestDetailContainer/ContestDetailContainer';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import { Header } from '~/components';
import DeviceLocationContainer from '~/containers/DeviceLocationContainer';

type Props = {
  children: any;
};

const LayoutContainer: React.FC<Props> = (props) => {
  const router = useRouter();
  const params = useQueryParams();
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

  const result = trpc.contest.listOffers.useQuery({
    contestId: params.contestId,
    league: params.league as League,
  });

  const { data: userTotalBalance, refetch } =
    trpc.user.userTotalBalance.useQuery();

  const tokenCount = result.data?.tokenCount;

  useEffect(() => {
    refetch();
  }, [cartStake, contestModal]);

  return (
    <>
      <Header />
      <DeviceLocationContainer />
      <ChangeRouteLoadingContainer />
      <Layout
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
      >
        {props.children}
      </Layout>
      <ContestDetailContainer />
      <ToastContainer />
    </>
  );
};

export default LayoutContainer;
