import {
  AppSettings,
  ContestCategory,
  League,
  LeagueLimit,
  ContestCategoryLeagueLimit,
  Prisma,
} from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { LeagueLimitType } from '~/schemas/LeagueLimitFormValidationSchema';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { mapUserBonusCreditLimits } from '~/utils/mapUserBonusCreditLimits';

/**
 * Map league limits to LeagueLimitType
 * @param leagueLimits - List of league limits
 * @param contestCategories - List of contest categories
 * @returns LeagueLimitType[]
 */
export const mapLeagueLimits = (
  leagueLimits: (LeagueLimit & {
    contestCategoryLeagueLimits: ContestCategoryLeagueLimit[];
  })[],
  contestCategories: ContestCategory[],
) => {
  return Object.keys(League).map((key) => {
    const leagueLimit = leagueLimits.find((x) => x.league === key);
    return {
      id: leagueLimit?.id || key,
      league: key as League,
      enabled: leagueLimit?.enabled || false,
      minStake: Number(leagueLimit?.minStake) || 0,
      maxStake: Number(leagueLimit?.maxStake) || 1,
      teamSelectionLimit: Number(leagueLimit?.teamSelectionLimit) || 0,
      contestCategoryLeagueLimits: contestCategories.map((contestCategory) => {
        const contestCategoryLeagueLimit =
          leagueLimit?.contestCategoryLeagueLimits.find(
            (x) => x.contestCategoryId === contestCategory.id,
          );
        return {
          contestCategoryId: contestCategory.id,
          numberOfPicks: contestCategory.numberOfPicks,
          enabled: contestCategoryLeagueLimit?.enabled || false,
          allInPayoutMultiplier:
            Number(contestCategoryLeagueLimit?.allInPayoutMultiplier) ||
            contestCategory.allInPayoutMultiplier,
          primaryInsuredPayoutMultiplier:
            Number(
              contestCategoryLeagueLimit?.primaryInsuredPayoutMultiplier,
            ) || contestCategory.primaryInsuredPayoutMultiplier,
          secondaryInsuredPayoutMultiplier:
            Number(
              contestCategoryLeagueLimit?.secondaryInsuredPayoutMultiplier,
            ) || contestCategory.secondaryInsuredPayoutMultiplier,
        };
      }),
    };
  }) as LeagueLimitType[];
};

/**
 * Fetches app settings and user settings
 * @param userId authenticated user id
 */
const getData = async (userId: string | undefined) => {
  const [
    appSettings,
    userAppSettings,
    user,
    leagueLimits,
    contestCategories,
    userBonusCreditLimits,
  ] = await prisma.$transaction([
    prisma.appSettings.findMany(),
    prisma.userAppSettings.findMany({
      where: {
        userId,
      },
    }),
    prisma.user.findFirst({
      where: {
        id: userId,
      },
    }),
    prisma.leagueLimit.findMany({
      include: {
        contestCategoryLeagueLimits: true,
      },
    }),
    prisma.contestCategory.findMany({
      include: {
        bonusCreditLimit: true,
      },
    }),
    prisma.userBonusCreditLimit.findMany({
      where: {
        userId,
      },
    }),
  ]);

  if (!appSettings || !user) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: CustomErrorMessages.APP_SETTINGS_NOT_FOUND,
    });
  }
  const bonusCreditLimits = contestCategories.map((contestCategory) => ({
    contestCategoryId: contestCategory.id,
    numberOfPicks: contestCategory.numberOfPicks,
    id: contestCategory.bonusCreditLimit?.id || 'NEW',
    enabled: contestCategory.bonusCreditLimit?.enabled || false,
    bonusCreditFreeEntryEquivalent:
      contestCategory.bonusCreditLimit?.bonusCreditFreeEntryEquivalent ||
      new Prisma.Decimal(0),
    stakeTypeOptions: contestCategory.bonusCreditLimit?.stakeTypeOptions || [],
  }));

  return [
    appSettings,
    userAppSettings,
    user,
    leagueLimits,
    contestCategories,
    bonusCreditLimits,
    userBonusCreditLimits,
  ] as [
    typeof appSettings,
    typeof userAppSettings,
    typeof user,
    typeof leagueLimits,
    typeof contestCategories,
    typeof bonusCreditLimits,
    typeof userBonusCreditLimits,
  ];
};

/**
 * To be ran over an array as a map function. Overrides app settings with user settings if they exist.
 * @param appSettingOverrides user app settings
 */
export function overrideValues(appSettingOverrides: AppSettings[]) {
  return (setting: AppSettings) => {
    const override = appSettingOverrides?.find((override) => {
      return override.name === setting.name;
    });
    return {
      ...setting,
      value: override?.value ?? setting.value,
    };
  };
}

export const getUserSettings = async (userId: string) => {
  const [
    appSettings,
    userAppSettings,
    user,
    leagueLimits,
    contestCategories,
    bonusCreditLimits,
    userBonusCreditLimits,
  ] = await getData(userId);
  return {
    user,
    allAppSettings: appSettings,
    userAppSettings: appSettings.map(overrideValues(userAppSettings)),
    leagueLimits: mapLeagueLimits(leagueLimits, contestCategories),
    bonusCreditLimits: mapUserBonusCreditLimits(
      userId,
      bonusCreditLimits,
      userBonusCreditLimits,
    ),
  };
};

/**
 * Get app settings and override with user settings if they exist
 */
export const list = isAuthenticated.query(async ({ ctx }) => {
  const userId = ctx.session.user?.id;
  if (!userId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: CustomErrorMessages.NOT_AUTHENTICATED_ERROR,
    });
  }
  return await getUserSettings(userId);
});
