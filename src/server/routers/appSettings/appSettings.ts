import { t } from '../../trpc';
import { prisma } from '~/server/prisma';
import { list, mapLeagueLimits } from './list';
import { adminProcedure } from '../admin/middleware/isAdmin';
import { AppSettingName, Prisma } from '@prisma/client';
import { contentList } from './contentList';
import { mapUserBonusCreditLimits } from '~/utils/mapUserBonusCreditLimits';

export const appSettingsRouter = t.router({
  list,
  getUserLimits:
    /**
     * Gets global and user specific limits for entry amounts.
     */
    adminProcedure.query(async () => {
      const [
        appSettings,
        userAppSettings,
        leagueLimits,
        contestCategories,
        userBonusCreditLimits,
      ] = await prisma.$transaction([
        prisma.appSettings.findMany({
          where: {
            name: {
              in: [
                AppSettingName.MIN_BET_AMOUNT,
                AppSettingName.MAX_BET_AMOUNT,
                AppSettingName.REPEAT_ENTRIES_LIMIT,
                AppSettingName.MAX_DAILY_TOTAL_BET_AMOUNT,
                AppSettingName.NUMBER_OF_PLAYERS_FREE_ENTRY,
                AppSettingName.STAKE_TYPE_FREE_ENTRY,
                AppSettingName.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT,
              ],
            },
          },
        }),
        prisma.userAppSettings.findMany({
          where: {
            name: {
              in: [
                AppSettingName.MIN_BET_AMOUNT,
                AppSettingName.MAX_BET_AMOUNT,
                AppSettingName.REPEAT_ENTRIES_LIMIT,
                AppSettingName.MAX_DAILY_TOTAL_BET_AMOUNT,
                AppSettingName.NUMBER_OF_PLAYERS_FREE_ENTRY,
                AppSettingName.STAKE_TYPE_FREE_ENTRY,
                AppSettingName.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT,
              ],
            },
          },
          include: {
            User: {
              select: {
                id: true,
                username: true,
              },
            },
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
        prisma.userBonusCreditLimit.findMany(),
      ]);

      const bonusCreditLimits = contestCategories.map((contestCategory) => ({
        contestCategoryId: contestCategory.id,
        numberOfPicks: contestCategory.numberOfPicks,
        id: contestCategory.bonusCreditLimit?.id || 'NEW',
        enabled: contestCategory.bonusCreditLimit?.enabled || false,
        bonusCreditFreeEntryEquivalent:
          contestCategory.bonusCreditLimit?.bonusCreditFreeEntryEquivalent ||
          new Prisma.Decimal(0),
        stakeTypeOptions:
          contestCategory.bonusCreditLimit?.stakeTypeOptions || [],
      }));
      type UserAppSettingsType = {
        userId: string;
        username: string;
        min: number;
        max: number;
        repeatEntries: number;
        maxDailyTotalBetAmount: number;
        bonusCreditLimits: {
          id: string;
          numberOfPicks: number;
          enabled: boolean;
          contestCategoryId: string;
          bonusCreditFreeEntryEquivalent: number;
          stakeType: string[];
        }[];
      };

      const map = new Map<string, UserAppSettingsType>();
      for (const record of userAppSettings) {
        if (record.name === AppSettingName.MIN_BET_AMOUNT) {
          const userSettings = map.get(record.userId);
          if (userSettings) {
            userSettings.min = Number(record.value);
            map.set(record.userId, userSettings);
          } else {
            map.set(record.userId, {
              userId: record.userId,
              username: record.User.username || 'unknown',
              min: Number(record.value),
              max: 0,
              repeatEntries: 0,
              maxDailyTotalBetAmount: 0,
              bonusCreditLimits: [],
            });
          }
        }
        if (record.name === AppSettingName.MAX_BET_AMOUNT) {
          const userSettings = map.get(record.userId);
          if (userSettings) {
            userSettings.max = Number(record.value);
            map.set(record.userId, userSettings);
          } else {
            map.set(record.userId, {
              userId: record.userId,
              username: record.User.username || 'unknown',
              min: 0,
              max: Number(record.value),
              repeatEntries: 0,
              maxDailyTotalBetAmount: 0,
              bonusCreditLimits: [],
            });
          }
        }
        if (record.name === AppSettingName.REPEAT_ENTRIES_LIMIT) {
          const userSettings = map.get(record.userId);
          if (userSettings) {
            userSettings.repeatEntries = Number(record.value);
            map.set(record.userId, userSettings);
          } else {
            map.set(record.userId, {
              userId: record.userId,
              username: record.User.username || 'unknown',
              min: 0,
              max: 0,
              repeatEntries: Number(record.value),
              maxDailyTotalBetAmount: 0,
              bonusCreditLimits: [],
            });
          }
        }
        if (record.name === AppSettingName.MAX_DAILY_TOTAL_BET_AMOUNT) {
          const userSettings = map.get(record.userId);
          if (userSettings) {
            userSettings.maxDailyTotalBetAmount = Number(record.value);
            map.set(record.userId, userSettings);
          } else {
            map.set(record.userId, {
              userId: record.userId,
              username: record.User.username || 'unknown',
              min: 0,
              max: 0,
              repeatEntries: 0,
              maxDailyTotalBetAmount: Number(record.value),
              bonusCreditLimits: [],
            });
          }
        }
      }

      return {
        appSettings: appSettings.reduce(
          (acc, cur) => {
            if (cur.name === AppSettingName.MIN_BET_AMOUNT) {
              acc.min = Number(cur.value);
            }
            if (cur.name === AppSettingName.MAX_BET_AMOUNT) {
              acc.max = Number(cur.value);
            }
            if (cur.name === AppSettingName.REPEAT_ENTRIES_LIMIT) {
              acc.repeatEntries = Number(cur.value);
            }
            if (cur.name === AppSettingName.MAX_DAILY_TOTAL_BET_AMOUNT) {
              acc.maxDailyTotalBetAmount = Number(cur.value);
            }
            return acc;
          },
          {
            min: 0,
            max: 0,
            repeatEntries: 0,
            maxDailyTotalBetAmount: 0,
            numberOfPlayers: [],
            bonusCreditLimits,
          },
        ),
        userAppSettings: Array.from(map.values()).map((userAppSettings) => ({
          ...userAppSettings,
          bonusCreditLimits: mapUserBonusCreditLimits(
            userAppSettings.userId,
            bonusCreditLimits,
            userBonusCreditLimits,
          ),
        })),
        leagueLimits: mapLeagueLimits(leagueLimits, contestCategories),
      };
    }),
  banners: t.procedure.query(async () => {
    return await prisma.banner.findMany({
      orderBy: {
        priority: 'asc',
      },
      include: {
        appSetting: true,
      },
    });
  }),
  contentList,
});
