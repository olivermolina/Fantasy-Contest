import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings, UserType } from '@prisma/client';
import { trpcClient } from '~/utils/trpcClient/trpcClient';
import type { UserTotalBalanceInterface } from '~/server/routers/user/userTotalBalance/getUserTotalBalance';

export interface UserDetails {
  id: string;
  username: string;
  email: string;
  image: string;
  followers: number;
  following: number;
  showFollowers?: boolean;
  isFirstDeposit?: boolean;
  isAdmin?: boolean;
  firstname: string;
  lastname: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  dob: string;
  type?: UserType;
}

interface ProfileModel {
  loading: boolean;
  userDetails?: UserDetails;
  appSettings?: AppSettings[];
  openLocationDialog: boolean;
  totalBalance?: UserTotalBalanceInterface;
}

/**
 * Fetches user total balance from the server and caches them in the store.
 */
export const fetchUserTotalBalance = createAsyncThunk(
  'profileUserTotalBalance/fetch',
  async (input, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const result = await trpcClient().user.userTotalBalance.query({
      userId: '',
    });
    dispatch(setUserTotalBalance(result));
    return result;
  },
);

const initialProfile: ProfileModel = {
  loading: false,
  openLocationDialog: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState: initialProfile,
  reducers: {
    reset: () => initialProfile,
    setUserDetails(state, action: PayloadAction<UserDetails>) {
      state.userDetails = action.payload;
      return state;
    },
    setAppSettings(state, action: PayloadAction<AppSettings[]>) {
      state.appSettings = action.payload;
      return state;
    },
    setOpenLocationDialog(state, action: PayloadAction<boolean>) {
      state.openLocationDialog = action.payload;
      return state;
    },
    setUserTotalBalance(
      state,
      action: PayloadAction<UserTotalBalanceInterface>,
    ) {
      state.totalBalance = action.payload;
      return state;
    },
  },
});

export const {
  reset,
  setUserDetails,
  setAppSettings,
  setOpenLocationDialog,
  setUserTotalBalance,
} = profileSlice.actions;

export default profileSlice.reducer;
