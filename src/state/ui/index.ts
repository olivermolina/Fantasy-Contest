import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContestCategory, ContestWagerType } from '@prisma/client';

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
}

const initialUI: UIModel = {
  loading: false,
  activeContestDetailModal: undefined,
  selectedContest: undefined,
  selectedContestCategory: undefined,
  contestCategories: [],
};

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
  },
});

export const {
  setLoading,
  reset,
  setActiveContestDetailModal,
  setSelectedContest,
  setSelectedContestCategory,
  setContestCategories,
} = uiSlice.actions;

export default uiSlice.reducer;
