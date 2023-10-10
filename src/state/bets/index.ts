import {
  BetStakeType,
  ContestType,
  ContestWagerType,
  League,
} from '@prisma/client';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '../store';
import {
  ContestCategoryWithBonusCreditLimit,
  setCartMessage,
  setSelectedContestCategory,
} from '~/state/ui';
import { FantasyCardFreeSquareProps } from '~/components/FantasyPicker/FantasyCard';
import { trpcClient } from '~/utils/trpcClient/trpcClient';

export interface BaseModel {
  betId: string;
  challengerId?: number;
  contest: string;
  contestType: ContestType;
  contestCategory: ContestCategoryWithBonusCreditLimit;
  contestWagerType?: ContestWagerType;
  stakeType: BetStakeType;
  error?: string;
}

export interface BetModel extends BaseModel {
  total: any;
  gameId: string;
  marketId: string;
  marketSelId: number;
  league: League;
  matchTime: string;
  entity1: string;
  entity2: string;
  line: string;
  stake: number;
  odds: number;
  type: 'total' | 'moneyline' | 'spread';
  teamId: string;
  team: 'away' | 'home' | 'over' | 'under';
  name: string;
  statName: string;
  playerId: string;
  freeSquare: FantasyCardFreeSquareProps | null;
}

export interface ParlayModel extends BaseModel {
  legs: BetModel[];
  stake: number;
}

export interface TeaserModel extends ParlayModel {
  type: 'teaser';
}

const betsAdapter = createEntityAdapter<ParlayModel | TeaserModel>({
  selectId: (bet) => bet.betId,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.betId.localeCompare(b.betId),
});

export const addToTeaserBet = createAsyncThunk(
  'bets/addToTeaserBet',
  (bet: BetInput, thunkAPI) => {
    if (bet.type === 'moneyline') {
      toast.error(`Unable to entry the moneyline on teaser bets.`);
      return;
    }
    const state = thunkAPI.getState() as RootState;
    const allBets = selectAllBets(state);
    const teaser = allBets.find(
      (bet) => 'legs' in bet && 'type' in bet,
    ) as TeaserModel;
    if (!teaser) {
      thunkAPI.dispatch(addTeaserBet(bet));
    } else {
      const legs = [...teaser.legs];
      if (legs.findIndex((leg) => leg.gameId === bet.gameId) !== -1) {
        toast.error(
          `Already included this a entry from this game in the parlay.`,
        );
      } else if (legs.length > 1) {
        toast.error(`Teasers only support two different game picks.`);
      } else {
        legs.push(addIdToBet(bet));
        thunkAPI.dispatch(
          updateBet({
            id: teaser.betId,
            changes: {
              contest: bet.contest,
              legs,
              contestCategory: bet.contestCategory,
            },
          }),
        );
      }
    }
  },
);

export interface RemoveBetLegInput {
  betId: string;
  marketId: string;
}

export const removeLegFromBetLegs = createAsyncThunk(
  'bets/removeLegFromBetLegs',
  (input: RemoveBetLegInput, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const bet = selectBetById(state, input.betId);
    if (!bet) {
      toast.error(`Unable to remove item from entry ${input.betId}`);
      return;
    }
    const newLegs = bet.legs.filter((leg) => leg.marketId !== input.marketId);
    if (newLegs.length) {
      const contestCategories = state.ui.contestCategories;
      const selectedContestCategory = contestCategories?.find(
        (contestCategory) => contestCategory.numberOfPicks === newLegs.length,
      );
      if (selectedContestCategory) {
        thunkAPI.dispatch(setSelectedContestCategory(selectedContestCategory));
      }

      thunkAPI.dispatch(
        updateBet({
          id: input.betId,
          changes: {
            legs: newLegs,
            contestCategory: selectedContestCategory || bet.contestCategory,
          },
        }),
      );
    } else {
      thunkAPI.dispatch(removeBet(input.betId));
    }
  },
);

export interface UpdateBetStakeTypeInput {
  betId: string;
  stakeType: BetStakeType;
}

export const updateBetStakeType = createAsyncThunk(
  'bets/updateBetStakeType',
  (input: UpdateBetStakeTypeInput, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const bet = selectBetById(state, input.betId);
    if (!bet) {
      toast.error(`Unable to update entry type`);
      return;
    }

    thunkAPI.dispatch(
      updateBet({
        id: input.betId,
        changes: {
          stakeType: input.stakeType,
        },
      }),
    );
  },
);

export function addIdToBet(bet: BetInput): BetModel {
  return {
    ...bet,
    betId: bet.gameId.toString(),
  };
}

export const updateAllBetsContestCategory = createAsyncThunk(
  'bets/updateAllBetsContestCategory',
  (contestCategory: ContestCategoryWithBonusCreditLimit, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const allBets = selectAllBets(state);
    for (const bet of allBets) {
      // Update cart items
      const newLegs = [...bet.legs].slice(0, contestCategory.numberOfPicks);
      thunkAPI.dispatch(
        updateBet({
          id: bet.betId,
          changes: {
            contestCategory,
            legs: newLegs,
          },
        }),
      );
    }
  },
);

/**
 * This will check the bet legs to see if any of the markets have been updated
 * and show it to the user
 */
export const checkBetLegData = createAsyncThunk(
  'bets/checkBetLegData',
  async (input, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const state = thunkAPI.getState() as RootState;
    const allBets = selectAllBets(state);
    if (!allBets || allBets.length === 0) {
      return;
    }

    const bet = allBets[0];
    if (!bet || bet.legs.length === 0) {
      return;
    }

    const offerIds = bet.legs.map((leg) => leg.marketId) as [
      string,
      ...string[],
    ];

    const updatedMarkets = await trpcClient().contest.listOffersByIds.query({
      offerIds,
    });

    let description = 'The following Stat Total has been updated: <br/> <br/>';
    const updatedLegs: BetModel[] = [];
    bet.legs.forEach((leg) => {
      const updatedMarket = updatedMarkets.find(
        (market) => market.marketId === leg.marketId,
      );

      if (!updatedMarket) return;

      const line = leg.freeSquare
        ? Number(updatedMarket.total) -
          Number(updatedMarket.total) * (leg.freeSquare.discount / 100)
        : updatedMarket?.total;

      if (updatedMarket && line !== Number(leg.line)) {
        description += `<b>${leg.name}</b> from <b>${leg.line}</b> to <b>${line} ${leg.statName}</b>. <br/>`;
        updatedLegs.push({
          ...leg,
          total: updatedMarket.total,
          line: line.toString(),
        });
      }
    });
    if (updatedLegs.length > 0) {
      dispatch(
        updateBet({
          id: bet.betId,
          changes: {
            legs: bet.legs
              .filter((row) =>
                updatedLegs.every((uleg) => uleg.marketId !== row.marketId),
              )
              .concat(updatedLegs),
          },
        }),
      );

      dispatch(setCartMessage(description));
    }
  },
);

export type BetInput = Omit<BetModel, 'betId'>;

export const betsSlice = createSlice({
  name: 'bets',
  initialState: betsAdapter.getInitialState(),
  reducers: {
    addBet(state, action: PayloadAction<BetInput>) {
      const bet: ParlayModel = {
        legs: [addIdToBet(action.payload)],
        betId: action.payload.gameId.toString(),
        contest: action.payload.contest,
        contestType: action.payload.contestType,
        contestCategory: action.payload.contestCategory,
        contestWagerType: action.payload.contestWagerType,
        stakeType: action.payload.stakeType,
        stake: 0,
      };
      return betsAdapter.addOne(state, bet);
    },
    addParlayBet(state, action: PayloadAction<BetInput>) {
      const bet: ParlayModel = {
        legs: [addIdToBet(action.payload)],
        betId: Math.floor(Math.random() * 1000).toString(),
        contest: action.payload.contest,
        contestType: action.payload.contestType,
        contestWagerType: action.payload.contestWagerType,
        contestCategory: action.payload.contestCategory,
        stakeType: action.payload.stakeType,
        stake: 0,
      };
      return betsAdapter.addOne(state, bet);
    },
    addTeaserBet(state, action: PayloadAction<BetInput>) {
      const bet: TeaserModel = {
        legs: [addIdToBet(action.payload)],
        betId: Math.floor(Math.random() * 1000).toString(),
        stake: 0,
        contest: action.payload.contest,
        contestType: action.payload.contestType,
        contestCategory: action.payload.contestCategory,
        contestWagerType: action.payload.contestWagerType,
        stakeType: action.payload.stakeType,
        type: 'teaser',
      };
      return betsAdapter.addOne(state, bet);
    },
    removeBet: betsAdapter.removeOne,
    removeAllBets: betsAdapter.removeAll,
    updateBet: betsAdapter.updateOne,
    reset: () => betsAdapter.getInitialState(),
  },
});

export const {
  addBet,
  removeBet,
  removeAllBets,
  updateBet,
  reset,
  addParlayBet,
  addTeaserBet,
} = betsSlice.actions;

// Rename the exports for readability in component usage
export const {
  selectById: selectBetById,
  selectIds: selectBetIds,
  selectEntities: selectBetEntities,
  selectAll: selectAllBets,
  selectTotal: selectTotalBets,
} = betsAdapter.getSelectors((state: RootState) => state.bets);

export { addToParlayBet } from './addToParlayBet';

export default betsSlice.reducer;
