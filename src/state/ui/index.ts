import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContestCategory, ContestWagerType } from '@prisma/client';
import { trpcClient } from '~/utils/trpcClient/trpcClient';

interface ContestUI {
  id: string;
  wagerType: ContestWagerType;
}

interface UIModel {
  loading: boolean;
  /**
   * When a number is present will show a modal that will load contest data and allow a user to join.
   */
  activeContestDetailModal?: string;
  selectedContest?: ContestUI;
  selectedContestCategory?: ContestCategory;
  contestCategories?: ContestCategory[];
  categoryBgColor: string;
}

const initialUI: UIModel = {
  loading: false,
  activeContestDetailModal: undefined,
  selectedContest: undefined,
  selectedContestCategory: undefined,
  contestCategories: [],
  categoryBgColor: 'white',
};

/**
 * Fetches contest category from the server and caches them in the store.
 */
export const fetchContestCategory = createAsyncThunk(
  'uiContestCategory/fetch',
  async (input, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const result = await trpcClient().contest.contestCategoryList.query();
    dispatch(setContestCategories(result));
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
    setSelectedContestCategory(state, payload: PayloadAction<ContestCategory>) {
      state.selectedContestCategory = payload.payload;
      return state;
    },
    setContestCategories(state, payload: PayloadAction<ContestCategory[]>) {
      state.contestCategories = payload.payload;
      return state;
    },
    setCategoryBgColor(state, payload: PayloadAction<string>) {
      state.categoryBgColor = payload.payload;
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
} = uiSlice.actions;

export default uiSlice.reducer;
