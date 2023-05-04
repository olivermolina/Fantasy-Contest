import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { removeBet, selectAllBets, updateBet } from '../../state/bets';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  mapParlayToCartItem,
  mapStraightToCartItem,
  mapTeaserToCartItem,
} from './mapData';
import Link from 'next/link';
import { Cart, CartProps } from '~/components/Cart';
import { formatLegType } from '~/utils/formatLegType';
import { BetType, ContestWagerType } from '@prisma/client';
import { trpc } from '~/utils/trpc';
import {
  GeolocationPermissionStatus,
  getGeolocationPermissionStatus,
} from '~/utils/getGeolocationPermissionStatus';
import { fetchUserTotalBalance, setOpenLocationDialog } from '~/state/profile';
import { useDeviceGPS } from '~/hooks/useDeviceGPS';
import { fetchAppSettings } from '~/state/appSettings';
import { setSelectedContestCategory } from '~/state/ui';
import { calculateFreeEntryCount } from '~/utils/calculateFreeEntryCount';
import { calculateFreeEntryStake } from '~/utils/calculateFreeEntryStake';

interface Props {
  clientIp: string;
  isChallengePage?: boolean;
}

const CartContainer = (props: Props) => {
  const dispatch = useAppDispatch();
  const contestCategory = useAppSelector(
    (state) => state.ui.selectedContestCategory,
  );
  const contestCategories = useAppSelector(
    (state) => state.ui.contestCategories,
  );
  const deviceGPS = useDeviceGPS();
  const { isLoading, mutateAsync } = trpc.bets.placeBet.useMutation();
  const [selectedTab, setTab] = useState<CartProps['activeTab']>('playerOU');
  const bets = useAppSelector((state) => selectAllBets(state));
  const [
    minBetAmount,
    maxBetAmount,
    numberOfPlayersFreeEntry,
    stakeTypeFreeEntry,
    bonusCreditFreeEntryEquivalent,
  ] = useAppSelector((state) => [
    state.appSettings.MIN_BET_AMOUNT,
    state.appSettings.MAX_BET_AMOUNT,
    state.appSettings.NUMBER_OF_PLAYERS_FREE_ENTRY,
    state.appSettings.STAKE_TYPE_FREE_ENTRY,
    state.appSettings.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT,
  ]);

  const userTotalBalance = useAppSelector(
    (state) => state.profile.totalBalance,
  );

  const selectedContest = useAppSelector((state) => state.ui.selectedContest);

  const openLocationDialog = useCallback(
    () => dispatch(setOpenLocationDialog(true)),
    [dispatch],
  );

  useEffect(() => {
    dispatch(fetchAppSettings());
  }, [dispatch]);

  const showErrorMessageOnBet = (betId: string, errorMsg: string) => {
    dispatch(
      updateBet({
        id: betId,
        changes: {
          error: errorMsg || 'Unknown error.',
        },
      }),
    );
  };

  const freeEntryCount = useMemo(
    () =>
      calculateFreeEntryCount(
        userTotalBalance?.creditAmount || 0,
        Number(bonusCreditFreeEntryEquivalent),
      ),
    [userTotalBalance, bonusCreditFreeEntryEquivalent],
  );

  const removeBetFromState = (betId: string) => dispatch(removeBet(betId));

  const onSubmitBet = async () => {
    const permissionStatus = await getGeolocationPermissionStatus();
    if (permissionStatus !== GeolocationPermissionStatus.GRANTED) {
      openLocationDialog();
      return;
    }

    const betModels = bets;
    for (const bet of betModels) {
      try {
        const isTeaser = 'type' in bet;
        if (isTeaser && bet.legs.length !== 2) {
          toast.error(`Teasers require two entries`);
          return;
        }

        const freeEntryPickEntries = numberOfPlayersFreeEntry.split(',');
        if (
          freeEntryCount > 0 &&
          !freeEntryPickEntries.includes(bet.legs.length.toString())
        ) {
          toast.error(
            `Free entry is only allowed to be placed on ${freeEntryPickEntries.join(
              ',',
            )} pick entries`,
          );
          return;
        }

        if (bet.legs.length !== contestCategory?.numberOfPicks) {
          toast.error(`Require ${contestCategory?.numberOfPicks} entries.`);
          return;
        }

        const freeSquareLeg = bet.legs.find((leg) => leg.freeSquare);
        if (freeSquareLeg) {
          const pickCategoryNumbers =
            freeSquareLeg.freeSquare?.pickCategories.map(
              (row) => row.numberOfPicks,
            ) || [];

          if (!pickCategoryNumbers.includes(bet.legs.length)) {
            toast.error(
              `The number of players for an entry with a free square is only available for ${pickCategoryNumbers.join(
                ', ',
              )} picks. Please adjust your number of players to continue.`,
            );
            return;
          }
        }

        if (!deviceGPS) {
          toast.error(`Invalid location.`);
          return;
        }

        await mutateAsync({
          stake: bet.stake,
          legs: bet.legs.map((l) => ({
            offerId: l.gameId,
            marketId: l.marketId,
            marketSelId: l.marketSelId,
            type: formatLegType(l.type, l.team),
            total: l.total,
            league: l.league,
          })),
          contestId: bet.contest,
          contestCategoryId: contestCategory.id,
          type: isTeaser
            ? BetType.TEASER
            : bet.legs.length > 1
            ? BetType.PARLAY
            : BetType.STRAIGHT,
          stakeType: bet.stakeType,
          ipAddress: props.clientIp,
          deviceGPS,
        });

        // Reset the required number of picks selected to 2 picks
        const twoPickCategory = contestCategories?.find(
          (pickCategory) => pickCategory.numberOfPicks === 2,
        );
        if (twoPickCategory) {
          dispatch(setSelectedContestCategory(twoPickCategory));
        }
        removeBetFromState(bet.betId);
        toast.success(`Successfully placed entry with id: ${bet.betId}.`);
        // Refetch user total balance
        dispatch(fetchUserTotalBalance());
      } catch (error: any) {
        toast.error(
          error.shape?.message ||
            `There was an error submitting entry with id: ${bet.betId}.`,
        );

        showErrorMessageOnBet(bet.betId, error.data?.message);
      }
    }
  };

  const cartItems = useMemo(
    () =>
      bets
        .filter((bet) =>
          selectedTab === 'playerOU'
            ? bet.contestWagerType === ContestWagerType.CASH
            : bet.contestWagerType === ContestWagerType.TOKEN,
        )
        .map((bet) => {
          const isStraightBet = !('legs' in bet);
          if (isStraightBet) {
            return mapStraightToCartItem(bet, dispatch);
          } else {
            const isTeaser = 'type' in bet;
            if (isTeaser) {
              return mapTeaserToCartItem(bet, dispatch);
            } else {
              return mapParlayToCartItem(bet, dispatch);
            }
          }
        }),
    [bets, selectedTab, selectedContest, contestCategory, dispatch],
  );

  const freeEntryStake = useMemo(
    () =>
      calculateFreeEntryStake(
        Number(userTotalBalance?.creditAmount),
        Number(bonusCreditFreeEntryEquivalent),
      ),
    [userTotalBalance, bonusCreditFreeEntryEquivalent],
  );

  const maximumEntryFee = useMemo(() => {
    if (!bets) {
      return maxBetAmount;
    }
    const freeSquareLeg = bets[0]?.legs.find((leg) => leg.freeSquare);
    if (freeSquareLeg) {
      return freeSquareLeg.freeSquare?.maxStake;
    }

    return maxBetAmount;
  }, [maxBetAmount, bets]);

  useEffect(() => {
    if (selectedContest) {
      setTab(
        selectedContest.wagerType === ContestWagerType.CASH
          ? 'playerOU'
          : 'teamToken',
      );
    }
  }, [selectedContest]);

  useEffect(() => {
    dispatch(fetchUserTotalBalance());
  }, [dispatch]);

  return (
    <Cart
      onClickSubmitForm={onSubmitBet}
      activeTab={selectedTab}
      links={[
        <Link key={'/privacy'} href="/privacy">
          Privacy
        </Link>,
        <Link key={'/terms'} href="/terms">
          Terms
        </Link>,
        <Link key={'/advertising'} href="/advertising">
          Advertising
        </Link>,
        <Link key={'/Cookies'} href="/Cookies">
          Cookies
        </Link>,
      ]}
      showLoading={isLoading}
      cartItems={cartItems}
      minimumEntryFee={Number(minBetAmount)}
      maximumEntryFee={Number(maximumEntryFee)}
      freeEntryCount={freeEntryCount}
      freeEntryStake={freeEntryStake}
      stakeTypeFreeEntry={stakeTypeFreeEntry}
      isChallengePage={props.isChallengePage}
    />
  );
};

export default CartContainer;
