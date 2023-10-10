import { getEntryFeeLimits } from './getEntryFeeLimits';
import {
  appSettingsListMock,
  betsMock,
  betsWithFreeSquareMock,
  contestCategoryMock,
  legWithFreeSquareMock,
} from '~/utils/__mocks__/getEntryFeeLimitsMocks';

describe('getEntryFeeLimits', () => {
  const min = 1;
  const max = 100;

  it('should return the default limits when bets array is empty', () => {
    const result = getEntryFeeLimits({
      bets: [],
      defaultMinMax: {
        min,
        max,
      },
    });
    expect(result).toEqual({ min, max });
  });

  it('should calculate the limits based on free square', () => {
    const result = getEntryFeeLimits({
      bets: betsWithFreeSquareMock,
      defaultMinMax: {
        min,
        max,
      },
      leagueLimits: appSettingsListMock.leagueLimits,
      allAppSettings: appSettingsListMock.allAppSettings,
      userAppSettings: appSettingsListMock.userAppSettings,
    });
    expect(result).toEqual({
      min,
      max: legWithFreeSquareMock.freeSquare.maxStake,
    });
  });

  it('should calculate the limits based on custom stake limit', () => {
    const result = getEntryFeeLimits({
      bets: betsMock,
      defaultMinMax: {
        min,
        max,
      },
      leagueLimits: appSettingsListMock.leagueLimits,
      allAppSettings: appSettingsListMock.allAppSettings,
      userAppSettings: appSettingsListMock.userAppSettings,
      contestCategory: {
        ...contestCategoryMock,
        customStakeLimitEnabled: true,
      },
    });
    expect(result).toEqual({
      min: Number(contestCategoryMock.minStakeAmount),
      max: Number(contestCategoryMock.maxStakeAmount),
    });
  });

  it('should calculate the limits based on league limits', () => {
    const result = getEntryFeeLimits({
      bets: betsMock,
      defaultMinMax: {
        min,
        max,
      },
      leagueLimits: appSettingsListMock.leagueLimits,
      allAppSettings: appSettingsListMock.allAppSettings,
      userAppSettings: appSettingsListMock.userAppSettings,
    });

    expect(result).toEqual({
      min: 1,
      max: 75,
    });
  });

  it('should return the default limits when no specific conditions are met', () => {
    const result = getEntryFeeLimits({
      bets: betsMock,
      defaultMinMax: {
        min,
        max,
      },
    });
    expect(result).toEqual({ min, max });
  });

  it('should return the free entry stake limit equivalent', () => {
    const freeEntryStake = 50;
    const result = getEntryFeeLimits({
      bets: betsMock,
      defaultMinMax: {
        min,
        max,
      },
      leagueLimits: appSettingsListMock.leagueLimits,
      allAppSettings: appSettingsListMock.allAppSettings,
      userAppSettings: appSettingsListMock.userAppSettings,
      freeEntryStake,
    });
    expect(result).toEqual({ min: freeEntryStake, max: freeEntryStake });
  });
});
