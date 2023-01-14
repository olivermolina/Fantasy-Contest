import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings } from '@prisma/client';

export interface UserDetails {
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
}

interface ProfileModel {
  loading: boolean;
  userDetails?: UserDetails;
  appSettings?: AppSettings[];
  openLocationDialog: boolean;
}

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
  },
});

export const { reset, setUserDetails, setAppSettings, setOpenLocationDialog } =
  profileSlice.actions;

export default profileSlice.reducer;
