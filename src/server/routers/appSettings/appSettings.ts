import { t } from '../../trpc';
import { prisma } from '~/server/prisma';
import { list } from './list';
import { adminProcedure } from '../admin/middleware/isAdmin';
import { AppSettingName } from '@prisma/client';

export const appSettingsRouter = t.router({
  list,
  getUserLimits:
    /**
     * Gets global and user specific limits for entry amounts.
     */
    adminProcedure.query(async () => {
      const [appSettings, userAppSettings] = await prisma.$transaction([
        prisma.appSettings.findMany({
          where: {
            name: {
              in: [
                AppSettingName.MIN_BET_AMOUNT,
                AppSettingName.MAX_BET_AMOUNT,
                AppSettingName.REPEAT_ENTRIES_LIMIT,
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
      ]);
      type UserAppSettingsType = {
        userId: string;
        username: string;
        min: number;
        max: number;
        repeatEntries: number;
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
            return acc;
          },
          {
            min: 0,
            max: 0,
            repeatEntries: 0,
          },
        ),
        userAppSettings: Array.from(map.values()),
      };
    }),
  banners: t.procedure.query(async () => {
    const banners = await prisma.banner.findMany({
      orderBy: {
        priority: 'asc',
      },
    });
    return banners;
  }),
});
