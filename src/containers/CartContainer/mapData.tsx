import {
  addToParlayBet,
  BetModel,
  ParlayModel,
  removeBet,
  removeLegFromBetLegs,
  TeaserModel,
  updateBet,
  updateBetStakeType,
} from '../../state/bets';
import { formatLegType } from '../../utils/formatLegType';
import shiftLine from '../../utils/shiftBet';
import { CartProps } from '~/components';
import { useAppDispatch } from '~/state/hooks';
import { BetStakeType } from '@prisma/client';
import { calculatePayout } from '~/utils/calculatePayout';
import { LeagueLimitType } from '~/schemas/LeagueLimitFormValidationSchema';

export type CartItemType = Omit<
  CartProps['cartItems'][0],
  'maxBetAmount' | 'minBetAmount' | 'freeEntryCount'
>;

function onUpdateCartItem(
  dispatch: ReturnType<typeof useAppDispatch>,
): (id: string, value: number) => void {
  return (id, value) => {
    dispatch(
      updateBet({
        id,
        changes: {
          stake: value,
        },
      }),
    );
  };
}

export function mapStraightToCartItem(
  bet: BetModel,
  dispatch: ReturnType<typeof useAppDispatch>,
): CartItemType {
  const calculatedPayout = calculatePayout({
    legs: [{ league: bet.league }],
    stake: bet.stake,
    contestCategory: bet.contestCategory,
  });
  return {
    id: bet.betId.toString(),
    legs: [
      {
        id: bet.betId,
        league: bet.league.toString(),
        matchTime: bet.matchTime,
        onClickDeleteCartItem: () => {
          dispatch(removeBet(bet.betId.toString()));
        },
        betName: bet.name,
        betOdds: bet.odds,
        betType: bet.line,
        awayTeamName: bet.entity2,
        homeTeamName: bet.entity1,
        statName: bet.name,
        betOption: bet.team,
        onClickMoreLess: (event, value) => {
          dispatch(addToParlayBet({ ...bet, team: value }));
        },
      },
    ],
    onUpdateCartItem: onUpdateCartItem(dispatch),
    stake: bet.stake.toString(),
    payout: calculatedPayout.allInPayout.toFixed(2),
    insuredPayout: calculatedPayout,
    wagerType: bet.contestWagerType,
    contestCategory: {
      ...bet.contestCategory,
      allInPayoutMultiplier: calculatedPayout.allInPayoutMultiplier,
      primaryInsuredPayoutMultiplier:
        calculatedPayout.primaryInsuredPayoutMultiplier,
      secondaryInsuredPayoutMultiplier:
        calculatedPayout.secondaryInsuredPayoutMultiplier,
    },
    stakeType: bet.stakeType,
    onUpdateBetStakeType: (stakeType: BetStakeType) => {
      dispatch(
        updateBetStakeType({
          betId: bet.betId.toString(),
          stakeType,
        }),
      );
    },
  };
}

export function mapParlayToCartItem(
  bet: ParlayModel,
  dispatch: ReturnType<typeof useAppDispatch>,
  leagueLimits: LeagueLimitType[] | undefined,
): CartItemType {
  const calculatedPayout = calculatePayout(bet, leagueLimits);

  return {
    id: bet.betId.toString(),
    legs: bet.legs.map((leg) => ({
      id: leg.gameId,
      league: leg.league,
      matchTime: leg.matchTime,
      onClickDeleteCartItem: () => {
        dispatch(
          removeLegFromBetLegs({
            betId: bet.betId.toString(),
            marketId: leg.marketId,
          }),
        );
      },
      betName: leg.name,
      statName: leg.statName,
      betOdds: leg.odds,
      betType: leg.freeSquare
        ? (
            Number(leg.line) -
            Number(leg.line) * (leg.freeSquare.discount / 100)
          ).toFixed(2)
        : leg.line,
      betOption: leg.team,
      awayTeamName: leg.entity2,
      homeTeamName: leg.entity1,
      onClickMoreLess: (event, value) => {
        dispatch(addToParlayBet({ ...leg, team: value }));
      },
    })),
    stake: bet.stake.toString(),
    payout: calculatedPayout.allInPayout.toFixed(2),
    insuredPayout: calculatedPayout,
    onUpdateCartItem: onUpdateCartItem(dispatch),
    wagerType: bet.contestWagerType,
    contestCategory: {
      ...bet.contestCategory,
      allInPayoutMultiplier: calculatedPayout.allInPayoutMultiplier,
      primaryInsuredPayoutMultiplier:
        calculatedPayout.primaryInsuredPayoutMultiplier,
      secondaryInsuredPayoutMultiplier:
        calculatedPayout.secondaryInsuredPayoutMultiplier,
    },
    stakeType: bet.stakeType,
    onUpdateBetStakeType: (stakeType: BetStakeType) => {
      dispatch(
        updateBetStakeType({
          betId: bet.betId.toString(),
          stakeType,
        }),
      );
    },
  };
}

export function mapTeaserToCartItem(
  bet: TeaserModel,
  dispatch: ReturnType<typeof useAppDispatch>,
): CartItemType {
  const calculatedPayout = calculatePayout(bet);
  return {
    id: bet.betId.toString(),
    legs: bet.legs.map((leg) => {
      const [type, number] = leg.line.split(' ');
      return {
        id: bet.betId,
        league: leg.league,
        matchTime: leg.matchTime,
        onClickDeleteCartItem: () => {
          dispatch(removeBet(bet.betId.toString()));
        },
        betName: leg.type,
        betOdds: leg.odds,
        betType:
          leg.team +
          type +
          ' ' +
          shiftLine(
            Number(number),
            leg.league,
            formatLegType(leg.type, leg.team),
          ),
        awayTeamName: leg.entity2,
        homeTeamName: leg.entity1,
        statName: leg.statName,
        betOption: leg.team,
        onClickMoreLess: (event, value) => {
          dispatch(addToParlayBet({ ...leg, team: value }));
        },
      };
    }),
    stake: bet.stake.toString(),
    payout: calculatedPayout.allInPayout.toFixed(2),
    insuredPayout: calculatedPayout,
    onUpdateCartItem: onUpdateCartItem(dispatch),
    wagerType: bet.contestWagerType,
    contestCategory: {
      ...bet.contestCategory,
      allInPayoutMultiplier: calculatedPayout.allInPayoutMultiplier,
      primaryInsuredPayoutMultiplier:
        calculatedPayout.primaryInsuredPayoutMultiplier,
      secondaryInsuredPayoutMultiplier:
        calculatedPayout.secondaryInsuredPayoutMultiplier,
    },
    stakeType: bet.stakeType,
    onUpdateBetStakeType: (stakeType: BetStakeType) => {
      dispatch(
        updateBetStakeType({
          betId: bet.betId.toString(),
          stakeType,
        }),
      );
    },
  };
}
