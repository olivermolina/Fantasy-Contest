import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettingName } from '@prisma/client';
import { DefaultAppSettings } from '~/constants/AppSettings';
import { RootState } from '../store';
import { trpcClient } from '~/utils/trpcClient/trpcClient';

type PickEnum<T, K extends T> = {
  [P in keyof K]: P extends K ? P : never;
};

export type AppSettingsState = Record<
  PickEnum<
    AppSettingName,
    | 'MAX_BET_AMOUNT'
    | 'MIN_BET_AMOUNT'
    | 'REFERRAL_CREDIT_AMOUNT'
    | 'MAX_MATCH_DEPOSIT_AMOUNT'
    | 'MAX_RETENTION_BONUS'
    | 'RETENTION_BONUS_MATCH_MULTIPLIER'
    | 'RETENTION_BONUS_WEEKLY_CHANCE'
    | 'NUMBER_OF_PLAYERS_FREE_ENTRY'
    | 'STAKE_TYPE_FREE_ENTRY'
    | 'BONUS_CREDIT_FREE_ENTRY_EQUIVALENT'
    | 'REFERRAL_CUSTOM_TEXT'
    | 'DEPOSIT_AMOUNT_OPTIONS'
    | 'RELOAD_BONUS_TYPE'
    | 'RELOAD_BONUS_AMOUNT'
    | 'MIN_MARKET_ODDS'
    | 'MAX_MARKET_ODDS'
    | 'CHALLENGE_PROMO_MESSAGE'
    | 'REPEAT_ENTRIES_LIMIT'
    | 'SIGNUP_FREE_ENTRY'
    | 'MAX_DAILY_TOTAL_BET_AMOUNT'
    | 'WEEKLY_REFERRAL_MAX_AMOUNT_EARNED'
    | 'MIN_DEPOSIT_AMOUNT'
  >,
  string
> & {
  initial: boolean;
};

/**
 * Initial app settings to be used before the server settings are fetched.
 * Uses static values from the constants file.
 */
const initialappSettings: AppSettingsState = {
  [AppSettingName.MIN_BET_AMOUNT]: DefaultAppSettings.MIN_BET_AMOUNT.toString(),
  [AppSettingName.MAX_BET_AMOUNT]: DefaultAppSettings.MAX_BET_AMOUNT.toString(),
  [AppSettingName.REFERRAL_CREDIT_AMOUNT]:
    DefaultAppSettings.REFERRAL_CREDIT_AMOUNT.toString(),
  [AppSettingName.MAX_MATCH_DEPOSIT_AMOUNT]:
    DefaultAppSettings.MAX_MATCH_DEPOSIT_AMOUNT.toString(),
  [AppSettingName.MAX_RETENTION_BONUS]:
    DefaultAppSettings.MAX_RETENTION_BONUS.toString(),
  [AppSettingName.RETENTION_BONUS_MATCH_MULTIPLIER]:
    DefaultAppSettings.RETENTION_BONUS_MATCH_MULTIPLIER.toString(),
  [AppSettingName.RETENTION_BONUS_WEEKLY_CHANCE]:
    DefaultAppSettings.RETENTION_BONUS_WEEKLY_CHANCE.toString(),
  [AppSettingName.NUMBER_OF_PLAYERS_FREE_ENTRY]:
    DefaultAppSettings.NUMBER_OF_PLAYERS_FREE_ENTRY.toString(),
  [AppSettingName.STAKE_TYPE_FREE_ENTRY]:
    DefaultAppSettings.STAKE_TYPE_FREE_ENTRY,
  [AppSettingName.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT]:
    DefaultAppSettings.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT.toString(),
  [AppSettingName.REFERRAL_CUSTOM_TEXT]:
    DefaultAppSettings.REFERRAL_CUSTOM_TEXT,
  [AppSettingName.DEPOSIT_AMOUNT_OPTIONS]:
    DefaultAppSettings.DEPOSIT_AMOUNT_OPTIONS,
  [AppSettingName.RELOAD_BONUS_TYPE]: DefaultAppSettings.RELOAD_BONUS_TYPE,
  [AppSettingName.RELOAD_BONUS_AMOUNT]:
    DefaultAppSettings.RELOAD_BONUS_AMOUNT.toString(),
  [AppSettingName.MIN_MARKET_ODDS]:
    DefaultAppSettings.MIN_MARKET_ODDS.toString(),
  [AppSettingName.MAX_MARKET_ODDS]:
    DefaultAppSettings.MAX_MARKET_ODDS.toString(),
  [AppSettingName.CHALLENGE_PROMO_MESSAGE]:
    DefaultAppSettings.CHALLENGE_PROMO_MESSAGE,
  [AppSettingName.REPEAT_ENTRIES_LIMIT]:
    DefaultAppSettings.REPEAT_ENTRIES.toString(),
  [AppSettingName.SIGNUP_FREE_ENTRY]:
    DefaultAppSettings.SIGNUP_FREE_ENTRY.toString(),
  [AppSettingName.MAX_DAILY_TOTAL_BET_AMOUNT]:
    DefaultAppSettings.MAX_DAILY_TOTAL_BET_AMOUNT.toString(),
  [AppSettingName.WEEKLY_REFERRAL_MAX_AMOUNT_EARNED]:
    DefaultAppSettings.WEEKLY_REFERRAL_MAX_AMOUNT_EARNED.toString(),
  [AppSettingName.MIN_DEPOSIT_AMOUNT]:
    DefaultAppSettings.MIN_DEPOSIT_AMOUNT.toString(),
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
      !state.appSettings.initial &&
      typeof input === 'object' &&
      !input.refetch
    ) {
      return state.appSettings;
    }
    const result = await trpcClient().appSettings.list.query();
    const settings = result.userAppSettings.reduce((acc, setting) => {
      acc[setting.name] = setting.value;
      return acc;
    }, {} as Record<AppSettingName, string>);
    dispatch(setAll({ ...settings, initial: false }));
    return settings;
  },
);

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState: initialappSettings,
  reducers: {
    setAll(_state, action: PayloadAction<AppSettingsState>) {
      return action.payload;
    },
  },
});

export const { setAll } = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
