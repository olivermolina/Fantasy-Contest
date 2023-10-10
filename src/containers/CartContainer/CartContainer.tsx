import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  checkBetLegData,
  removeBet,
  selectAllBets,
  updateBet,
} from '../../state/bets';
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
import {
  fetchContestCategory,
  setCartMessage,
  setSelectedContestCategory,
} from '~/state/ui';
import { calculateFreeEntryCount } from '~/utils/calculateFreeEntryCount';
import { calculateFreeEntryStake } from '~/utils/calculateFreeEntryStake';
import { getEntryFeeLimits } from '~/utils/getEntryFeeLimits';
import { countBy } from 'lodash';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DefaultAppSettings } from '~/constants/AppSettings';

interface Props {
  clientIp: string;
  isChallengePage?: boolean;
}

const CartContainer = (props: Props) => {
  const dispatch = useAppDispatch();
  const { data: appSettings, isFetching } = trpc.appSettings.list.useQuery();
  const contestCategory = useAppSelector(
    (state) => state.ui.selectedContestCategory,
  );
  const contestCategories = useAppSelector(
    (state) => state.ui.contestCategories,
  );

  const cartMessage = useAppSelector((state) => state.ui.cartMessage);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const deviceGPS = useDeviceGPS();
  const { isLoading, mutateAsync } = trpc.bets.placeBet.useMutation();
  const [selectedTab, setTab] = useState<CartProps['activeTab']>('playerOU');
  const bets = useAppSelector((state) => selectAllBets(state));
  const [minBetAmount, maxBetAmount] = useAppSelector((state) => [
    state.appSettings.MIN_BET_AMOUNT,
    state.appSettings.MAX_BET_AMOUNT,
  ]);

  const { data: userTotalBalance, refetch: refetchUserTotalBalance } =
    trpc.user.userTotalBalance.useQuery();

  const selectedContest = useAppSelector((state) => state.ui.selectedContest);

  const openLocationDialog = useCallback(
    () => dispatch(setOpenLocationDialog(true)),
    [dispatch],
  );

  useEffect(() => {
    if (isFetching) {
      dispatch(fetchAppSettings());
      dispatch(fetchContestCategory());
    }
  }, [dispatch, isFetching]);

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

  const entryBonusCreditLimit = useMemo(() => {
    if (
      !appSettings ||
      !appSettings.bonusCreditLimits ||
      !bets ||
      bets.length === 0
    ) {
      return null;
    }

    return appSettings.bonusCreditLimits?.find(
      (bonusCreditLimit) =>
        bonusCreditLimit.numberOfPicks === bets[0]?.legs.length,
    );
  }, [appSettings, bets]);

  const bonusCreditFreeEntryEquivalent = useMemo(() => {
    if (!entryBonusCreditLimit) {
      return DefaultAppSettings.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT;
    }

    return (
      entryBonusCreditLimit?.bonusCreditFreeEntryEquivalent ||
      DefaultAppSettings.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT
    );
  }, [entryBonusCreditLimit]);

  const stakeTypeFreeEntry = useMemo(() => {
    if (
      !entryBonusCreditLimit ||
      !Array.isArray(entryBonusCreditLimit.stakeTypeOptions)
    ) {
      return '';
    }

    return entryBonusCreditLimit.stakeTypeOptions.toString();
  }, [entryBonusCreditLimit]);

  const freeEntryCount = useMemo(
    () =>
      calculateFreeEntryCount(
        userTotalBalance?.creditAmount || 0,
        Number(bonusCreditFreeEntryEquivalent),
      ),
    [userTotalBalance, bonusCreditFreeEntryEquivalent],
  );

  const removeBetFromState = (betId: string) => dispatch(removeBet(betId));

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
              return mapParlayToCartItem(
                bet,
                dispatch,
                appSettings?.leagueLimits,
              );
            }
          }
        }),
    [
      bets,
      selectedTab,
      selectedContest,
      contestCategory,
      dispatch,
      appSettings?.leagueLimits,
      cartMessage,
    ],
  );

  const freeEntryStake = useMemo(
    () =>
      calculateFreeEntryStake(
        Number(userTotalBalance?.creditAmount),
        Number(bonusCreditFreeEntryEquivalent),
      ),
    [userTotalBalance, bonusCreditFreeEntryEquivalent],
  );

  const entryFee = useMemo(
    () =>
      getEntryFeeLimits({
        bets: bets.map((bet) => ({
          legs: bet.legs.map((leg) => ({
            freeSquare: leg.freeSquare
              ? {
                  maxStake: leg.freeSquare?.maxStake,
                }
              : undefined,
            league: leg.league,
          })),
        })),
        freeEntryStake,
        contestCategory,
        userAppSettings: appSettings?.userAppSettings,
        allAppSettings: appSettings?.allAppSettings,
        leagueLimits: appSettings?.leagueLimits,
        defaultMinMax: {
          min: Number(minBetAmount),
          max: Number(maxBetAmount),
        },
      }),
    [
      appSettings,
      bets,
      contestCategory,
      freeEntryStake,
      minBetAmount,
      maxBetAmount,
      bonusCreditFreeEntryEquivalent,
    ],
  );

  const onSubmitBet: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    const permissionStatus = await getGeolocationPermissionStatus();
    if (permissionStatus !== GeolocationPermissionStatus.GRANTED) {
      openLocationDialog();
      return;
    }

    const betModels = bets;
    setIsSubmitting(true);
    for (const bet of betModels) {
      try {
        const isTeaser = 'type' in bet;
        if (isTeaser && bet.legs.length !== 2) {
          toast.error(`Teasers require two entries`);
          setIsSubmitting(false);
          return;
        }

        const freeEntryPickEntries = appSettings?.bonusCreditLimits.reduce(
          (acc: number[], row) => {
            if (row.enabled) {
              acc.push(row.numberOfPicks);
            }
            return acc;
          },
          [],
        );

        if (freeEntryCount > 0 && !entryBonusCreditLimit?.enabled) {
          toast.error(
            `Free entry is only allowed to be placed on ${freeEntryPickEntries?.join(
              ',',
            )} pick entries`,
          );
          setIsSubmitting(false);
          return;
        }

        if (bet.legs.length !== contestCategory?.numberOfPicks) {
          toast.error(`Require ${contestCategory?.numberOfPicks} entries.`);
          setIsSubmitting(false);
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
            setIsSubmitting(false);
            return;
          }
        }

        if (!deviceGPS) {
          toast.error(`Invalid location.`);
          setIsSubmitting(false);
          return;
        }

        if (bet.stake > Number(entryFee.max)) {
          toast.error(
            `You've exceeded the maximum entry fee. Max is $${entryFee.max.toFixed(
              2,
            )}.`,
          );
          setIsSubmitting(false);
          return;
        }

        if (bet.stake < Number(entryFee.min)) {
          toast.error(
            `Invalid entry fee. Minimum entry fees is $${entryFee.min.toFixed(
              2,
            )}.`,
          );
          setIsSubmitting(false);
          return;
        }

        const teamSelectionLimitLeagues = appSettings?.leagueLimits?.filter(
          (leagueLimit) => leagueLimit.teamSelectionLimit > 0,
        );

        // Check if user has exceeded the maximum number of same teams allowed for a league
        for (const leagueLimit of teamSelectionLimitLeagues || []) {
          // Filter legs by league
          const leagueLegs = bet.legs.filter(
            (leg) => leg.league === leagueLimit.league,
          );

          // Count the number of leagueLegs by teamId
          const countLeagueLegsByTeamId = countBy(leagueLegs, 'teamId');

          // Show error if user has exceeded the maximum number of same teams allowed for a league
          if (
            countLeagueLegsByTeamId &&
            Object.keys(countLeagueLegsByTeamId).find(
              (key) =>
                Number(countLeagueLegsByTeamId[key]) >
                leagueLimit.teamSelectionLimit,
            )
          ) {
            toast.error(
              `You've reached the maximum of ${leagueLimit.teamSelectionLimit} players from the same team. Please select players on other teams.`,
            );
            setIsSubmitting(false);
            return;
          }
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
            isFreeSquare: !!l.freeSquare,
            freeSquare: l.freeSquare
              ? {
                  maxStake: l.freeSquare.maxStake,
                }
              : undefined,
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
        refetchUserTotalBalance();
        dispatch(fetchUserTotalBalance());
      } catch (error: any) {
        toast.error(
          error.shape?.message ||
            `There was an error submitting entry with id: ${bet.betId}.`,
        );

        showErrorMessageOnBet(bet.betId, error.data?.message);
      }
    }
    setIsSubmitting(false);
  };

  const handleClose = () => {
    dispatch(setCartMessage(undefined));
  };

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
    if (isFetching) {
      dispatch(fetchUserTotalBalance());
      dispatch(checkBetLegData());
    }
  }, [dispatch, isFetching]);

  return (
    <>
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
        showLoading={isLoading || isSubmitting}
        cartItems={cartItems}
        minimumEntryFee={entryFee.min}
        maximumEntryFee={entryFee.max}
        freeEntryCount={freeEntryCount}
        freeEntryStake={Math.min(freeEntryStake, entryFee.max)}
        stakeTypeFreeEntry={stakeTypeFreeEntry}
        isChallengePage={props.isChallengePage}
      />

      <Dialog open={!!cartMessage} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">{'Your Picks'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div
              dangerouslySetInnerHTML={{
                __html: cartMessage || '',
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant={'contained'} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartContainer;
