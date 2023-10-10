import { LeagueLimitType } from '~/schemas/LeagueLimitFormValidationSchema';
import {
  AppSettingName,
  AppSettings,
  ContestCategory,
  League,
} from '@prisma/client';
import { DefaultAppSettings } from '~/constants/AppSettings';

interface GetEntryFeeLimitsProps {
  /**
   * Array representing the bets.
   */
  bets: {
    legs: {
      freeSquare?: {
        maxStake: number;
      };
      league: League;
    }[];
  }[];
  /**
   * AppSettings array.
   */
  allAppSettings?: AppSettings[];
  /**
   * UserAppSettings array.
   */
  userAppSettings?: { value: string; id: string; name: AppSettingName }[];
  /**
   * The free entry stake amount.
   */
  freeEntryStake?: number;
  /**
   * Optional ContestCategory object.
   */
  contestCategory?: ContestCategory;
  /**
   * Optional array of league limits.
   */
  leagueLimits?: LeagueLimitType[];
  defaultMinMax: {
    min: number;
    max: number;
  };
}

/**
 * Calculates the maximum and minimum entry fee for a bet.
 * @param GetEntryFeeLimitsProps - The parameters for the function.
 * @returns An object with the calculated minimum and maximum entry fee.
 */
export const getEntryFeeLimits = ({
  bets,
  allAppSettings,
  userAppSettings,
  freeEntryStake,
  contestCategory,
  leagueLimits,
  defaultMinMax,
}: GetEntryFeeLimitsProps) => {
  if (!allAppSettings || !userAppSettings || !bets || bets.length === 0) {
    return defaultMinMax;
  }

  const userMinMax = {
    min: Number(
      userAppSettings.find((s) => s.name === AppSettingName.MIN_BET_AMOUNT)
        ?.value || DefaultAppSettings.MIN_BET_AMOUNT,
    ),
    max: Number(
      userAppSettings.find((s) => s.name === AppSettingName.MAX_BET_AMOUNT)
        ?.value || DefaultAppSettings.MAX_BET_AMOUNT,
    ),
  };

  const globalMinMax = {
    min: Number(
      allAppSettings.find((s) => s.name === AppSettingName.MIN_BET_AMOUNT)
        ?.value || DefaultAppSettings.MIN_BET_AMOUNT,
    ),
    max: Number(
      allAppSettings.find((s) => s.name === AppSettingName.MAX_BET_AMOUNT)
        ?.value || DefaultAppSettings.MAX_BET_AMOUNT,
    ),
  };

  const { minStakeAmount, maxStakeAmount, customStakeLimitEnabled } =
    contestCategory || {};

  if (freeEntryStake && freeEntryStake > 0) {
    return {
      min:
        Number(maxStakeAmount) > 0
          ? Math.min(freeEntryStake, Number(maxStakeAmount))
          : freeEntryStake,
      max:
        Number(maxStakeAmount) > 0
          ? Math.min(freeEntryStake, Number(maxStakeAmount))
          : freeEntryStake,
    };
  }

  // Check if free square exists
  const freeSquareLeg = bets[0]?.legs.find((leg) => leg.freeSquare);
  if (freeSquareLeg) {
    return {
      min: userMinMax.min,
      max: Number(freeSquareLeg.freeSquare?.maxStake),
    };
  }

  // Check if custom stake limit is enabled
  if (customStakeLimitEnabled) {
    return {
      min: Number(minStakeAmount) || userMinMax.min,
      max: Number(maxStakeAmount) || userMinMax.max,
    };
  }

  // Check if user limits are different from global limits
  if (
    userMinMax.min !== globalMinMax.min ||
    userMinMax.max !== globalMinMax.max
  ) {
    return userMinMax;
  }

  const leagues = bets[0]?.legs.map((leg) => leg.league);
  // Check if league limits exist for the bet leagues
  if (leagueLimits) {
    const leagueEntryLimits = leagueLimits?.filter((leagueLimit) =>
      leagues?.some(
        (league) => leagueLimit.league === league && leagueLimit.enabled,
      ),
    );
    if (leagueEntryLimits.length > 0) {
      const minStakeLimits = leagueEntryLimits.map(
        (leagueEntryLimit) => leagueEntryLimit.minStake,
      );
      const maxStakeLimits = leagueEntryLimits.map(
        (leagueEntryLimit) => leagueEntryLimit.maxStake,
      );
      return {
        min: Math.min(...minStakeLimits),
        max: Math.min(...maxStakeLimits),
      };
    }
  }

  // Default limits
  return globalMinMax;
};
