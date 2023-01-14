import {
  BetModel,
  ParlayModel,
  removeBet,
  removeLegFromBetLegs,
  TeaserModel,
  updateBet,
  updateBetStakeType,
} from '../../state/bets';
import { formatLegType } from '../../utils/formatLegType';
import { calculateParlayPayout } from '../../utils/calculateParlayPayout';
import { calculateTeaserPayout } from '../../utils/caculateTeaserPayout';
import shiftLine from '../../utils/shiftBet';
import { calculateStraightPayout } from '../../utils/calculateStraightPayout';
import { CartProps } from '~/components';
import { useAppDispatch } from '~/state/hooks';
import { BetStakeType } from '@prisma/client';
import { calculateInsuredPayout } from '~/utils/calculateInsuredPayout';

type CartItem = CartProps['cartItems'][0];

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
): CartItem {
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
      },
    ],
    onUpdateCartItem: onUpdateCartItem(dispatch),
    stake: bet.stake.toString(),
    payout: calculateStraightPayout(bet),
    insuredPayout: calculateInsuredPayout(bet.stake, bet.contestCategory),
    wagerType: bet.contestWagerType,
    contestCategory: bet.contestCategory,
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
): CartItem {
  return {
    id: bet.betId.toString(),
    legs: bet.legs.map((leg) => ({
      id: bet.betId,
      league: leg.league,
      matchTime: leg.matchTime,
      onClickDeleteCartItem: () => {
        dispatch(
          removeLegFromBetLegs({
            betId: bet.betId.toString(),
            betLegName: leg.name,
          }),
        );
      },
      betName: leg.name,
      statName: leg.statName,
      betOdds: leg.odds,
      betType: leg.line,
      betOption: leg.team,
      awayTeamName: leg.entity2,
      homeTeamName: leg.entity1,
    })),
    stake: bet.stake.toString(),
    payout: calculateParlayPayout(
      bet.legs.map((bet) => bet.odds),
      bet.stake,
      bet.contestCategory,
    ).toString(),
    insuredPayout: calculateInsuredPayout(bet.stake, bet.contestCategory),
    onUpdateCartItem: onUpdateCartItem(dispatch),
    wagerType: bet.contestWagerType,
    contestCategory: bet.contestCategory,
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
): CartItem {
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
      };
    }),
    stake: bet.stake.toString(),
    payout: calculateTeaserPayout(bet.stake, bet.contestCategory).toString(),
    insuredPayout: calculateInsuredPayout(bet.stake, bet.contestCategory),
    onUpdateCartItem: onUpdateCartItem(dispatch),
    wagerType: bet.contestWagerType,
    contestCategory: bet.contestCategory,
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
