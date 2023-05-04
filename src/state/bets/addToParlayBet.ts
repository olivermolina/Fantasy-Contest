import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '../store';
import { setSelectedContestCategory } from '~/state/ui';
import {
  addIdToBet,
  addParlayBet,
  BetInput,
  BetModel,
  ParlayModel,
  removeLegFromBetLegs,
  selectAllBets,
  updateBet,
} from './index';
import { calculateFreeEntryCount } from '~/utils/calculateFreeEntryCount';

export const addToParlayBet = createAsyncThunk(
  'bets/addToParlayBet',
  (bet: BetInput, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const allBets = selectAllBets(state);
    const parlayBet = allBets.find(
      (betRow) => 'legs' in betRow && betRow.contest === bet.contest,
    ) as ParlayModel;

    // Show error if Free Square is not allowed in a Free Entry
    if (bet.freeSquare && !bet.freeSquare.freeEntryEnabled) {
      const bonusCredit = Number(state.profile.totalBalance?.creditAmount);
      const bonusCreditFreeEntryEquivalent = Number(
        state.appSettings.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT,
      );

      const freeEntryCount = calculateFreeEntryCount(
        bonusCredit,
        bonusCreditFreeEntryEquivalent,
      );

      if (freeEntryCount > 0) {
        toast.error(`You cannot select a Free Square in a Free Entry.`);
        return;
      }
    }

    // If no current parlay bet exists, create one.
    if (!parlayBet) {
      thunkAPI.dispatch(addParlayBet(bet));
    } else {
      const legs = [...parlayBet.legs];
      const betLegIndex = legs.findIndex((leg) => leg.gameId === bet.gameId);
      const prevSelectedContestCategory = state.ui.selectedContestCategory;
      let selectedContestCategory;
      const betLegAlreadyExistsInParlay = betLegIndex !== -1;

      if (betLegAlreadyExistsInParlay) {
        handleBetLegModification(
          bet,
          parlayBet,
          (args) => {
            thunkAPI.dispatch(removeLegFromBetLegs(args));
          },
          addIdToBet,
          (legs) => {
            thunkAPI.dispatch(
              updateBet({
                id: parlayBet.betId,
                changes: {
                  contest: bet.contest,
                  legs,
                  contestCategory: bet.contestCategory,
                },
              }),
            );
          },
        );
      } else {
        // Show error if player already in legs
        if (legs.findIndex((leg) => leg.playerId === bet.playerId) !== -1) {
          toast.error(`Cannot pick the same player twice in an entry.`);
          return;
        }

        // Show error if more than one free square is selected
        if (
          bet.freeSquare !== null &&
          legs.filter((leg) => leg.freeSquare !== null).length > 0
        ) {
          toast.error(`Cannot pick free square twice in an entry.`);
          return;
        }

        const contestCategories = state.ui.contestCategories;
        selectedContestCategory = contestCategories?.find(
          (contestCategory) =>
            contestCategory.numberOfPicks === legs.length + 1,
        );
        if (
          selectedContestCategory &&
          Number(selectedContestCategory?.numberOfPicks) >
            Number(prevSelectedContestCategory?.numberOfPicks)
        ) {
          thunkAPI.dispatch(
            setSelectedContestCategory(selectedContestCategory),
          );
        } else if (
          legs.length >= bet.contestCategory.numberOfPicks &&
          betLegIndex === -1
        ) {
          toast.error(
            `Maximum of ${bet.contestCategory.numberOfPicks} picks allowed.`,
          );
          return;
        }

        legs.push(
          addIdToBet({
            ...bet,
            contestCategory: selectedContestCategory || bet.contestCategory,
          }),
        );

        thunkAPI.dispatch(
          updateBet({
            id: parlayBet.betId,
            changes: {
              contest: bet.contest,
              legs,
              contestCategory: selectedContestCategory || bet.contestCategory,
            },
          }),
        );
      }
    }
  },
);

/**
 * Given a bet leg input, will check to see if that bet already exists. If it does the the same value, it will override the already
 * existing bet leg and update state. If it does, and is the same type, it will assume the user has double clicked and remove this bet from state.
 */
export function handleBetLegModification(
  betLegArgs: BetInput,
  parlayBet: Pick<ParlayModel, 'betId' | 'legs'>,
  // Dependency Injections
  removeLegFromBetLegs: (args: {
    betId: BetModel['betId'];
    marketId: BetModel['marketId'];
  }) => void,
  addIdToBet: (bet: Omit<BetModel, 'betId'>) => BetModel,
  updateBetLeg: (legs: ParlayModel['legs']) => void,
) {
  const legs = [...parlayBet.legs];
  const idxOfBetLegToBeAdded = legs.findIndex(
    (leg) => leg.gameId === betLegArgs.gameId,
  );
  const currLeg = legs[idxOfBetLegToBeAdded];
  const userHasDoubleClickedButton = betLegArgs.team === currLeg?.team;
  if (userHasDoubleClickedButton) {
    removeLegFromBetLegs({
      betId: parlayBet.betId.toString(),
      marketId: currLeg.marketId,
    });
  } else {
    // Override the old bet leg
    legs[idxOfBetLegToBeAdded] = addIdToBet(betLegArgs);
    updateBetLeg(legs);
  }
}
