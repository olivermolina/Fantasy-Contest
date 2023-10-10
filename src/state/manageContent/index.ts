import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettingName } from '@prisma/client';
import { DefaultAppSettings } from '~/constants/AppSettings';
import { RootState } from '../store';
import { trpcClient } from '~/utils/trpcClient/trpcClient';

type PickEnum<T, K extends T> = {
  [P in keyof K]: P extends K ? P : never;
};

export type ContentSettingsState = Record<
  PickEnum<
    AppSettingName,
    | 'CHALLENGE_PROMO_MESSAGE'
    | 'REFERRAL_CUSTOM_TEXT'
    | 'HOMEPAGE_HEADING_1'
    | 'HOMEPAGE_HEADING_2'
  >,
  string
> & {
  initial: boolean;
};

/**
 * Initial app settings to be used before the server settings are fetched.
 * Uses static values from the constants file.
 */
const initialappSettings: ContentSettingsState = {
  [AppSettingName.CHALLENGE_PROMO_MESSAGE]:
    DefaultAppSettings.CHALLENGE_PROMO_MESSAGE,
  [AppSettingName.REFERRAL_CUSTOM_TEXT]:
    DefaultAppSettings.REFERRAL_CUSTOM_TEXT,
  [AppSettingName.HOMEPAGE_HEADING_1]: DefaultAppSettings.HOMEPAGE_HEADING_1,
  [AppSettingName.HOMEPAGE_HEADING_2]: DefaultAppSettings.HOMEPAGE_HEADING_2,
  initial: true,
};
/**
 * Fetches app settings from the server and caches them in the store.
 */
export const fetchAppSettings = createAsyncThunk(
  'appSettings/fetch',
  async (input: { refetch: boolean } | void, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const state = getState() as RootState;
    if (
      !state.contentSettings.initial &&
      typeof input === 'object' &&
      !input.refetch
    ) {
      return state.contentSettings;
    }
    const result = await trpcClient().appSettings.contentList.query();
    const settings = result.reduce((acc, setting) => {
      acc[setting.name] = setting.value;
      return acc;
    }, {} as Record<AppSettingName, string>);
    dispatch(setAll({ ...settings, initial: false }));
    return settings;
  },
);

const contentSettingsSlice = createSlice({
  name: 'contentSettings',
  initialState: initialappSettings,
  reducers: {
    setAll(_state, action: PayloadAction<ContentSettingsState>) {
      return action.payload;
    },
  },
});

export const { setAll } = contentSettingsSlice.actions;

export default contentSettingsSlice.reducer;
