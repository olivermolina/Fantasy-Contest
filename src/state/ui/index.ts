import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ContestCategory,
  BonusCreditLimit,
  ContestWagerType,
} from '@prisma/client';
import { trpcClient } from '~/utils/trpcClient/trpcClient';
import { RootState } from '~/state/store';

interface ContestUI {
  id: string;
  wagerType: ContestWagerType;
}

export type ContestCategoryWithBonusCreditLimit = ContestCategory & {
  bonusCreditLimit: BonusCreditLimit | null;
};

interface UIModel {
  loading: boolean;
  /**
   * When a number is present will show a modal that will load contest data and allow a user to join.
   */
  activeContestDetailModal?: string;
  selectedContest?: ContestUI;
  selectedContestCategory?: ContestCategoryWithBonusCreditLimit;
  contestCategories?: ContestCategoryWithBonusCreditLimit[];
  categoryBgColor: string;
  cartMessage?: string;
}

const initialUI: UIModel = {
  loading: false,
  activeContestDetailModal: undefined,
  selectedContest: undefined,
  selectedContestCategory: undefined,
  categoryBgColor: 'white',
  cartMessage: undefined,
};

/**
 * Fetches contest category from the server and caches them in the store.
 */
export const fetchContestCategory = createAsyncThunk(
  'uiContestCategory/fetch',
  async (input, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const result = await trpcClient().contest.contestCategoryList.query();
    dispatch(setContestCategories(result));

    const state = getState() as RootState;
    if (state.ui.selectedContestCategory) {
      const newContestCategory = result.find(
        (contestCategory) =>
          contestCategory.id === state.ui.selectedContestCategory?.id,
      );
      if (newContestCategory) {
        dispatch(setSelectedContestCategory(newContestCategory));
      }
    }

    return result;
  },
);

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUI,
  reducers: {
    setLoading(state, payload: PayloadAction<boolean>) {
      state.loading = payload.payload;
    },
    reset: () => initialUI,
    setActiveContestDetailModal(state, payload: PayloadAction<string>) {
      state.activeContestDetailModal = payload.payload;
      return state;
    },
    setSelectedContest(state, payload: PayloadAction<ContestUI>) {
      state.selectedContest = payload.payload;
      return state;
    },
    setSelectedContestCategory(
      state,
      payload: PayloadAction<ContestCategoryWithBonusCreditLimit>,
    ) {
      state.selectedContestCategory = payload.payload;
      return state;
    },
    setContestCategories(
      state,
      payload: PayloadAction<ContestCategoryWithBonusCreditLimit[]>,
    ) {
      state.contestCategories = payload.payload;
      return state;
    },
    setCategoryBgColor(state, payload: PayloadAction<string>) {
      state.categoryBgColor = payload.payload;
      return state;
    },
    setCartMessage(state, payload: PayloadAction<string | undefined>) {
      state.cartMessage = payload.payload;
      return state;
    },
  },
});

export const {
  setLoading,
  reset,
  setActiveContestDetailModal,
  setSelectedContest,
  setSelectedContestCategory,
  setContestCategories,
  setCategoryBgColor,
  setCartMessage,
} = uiSlice.actions;

export default uiSlice.reducer;
