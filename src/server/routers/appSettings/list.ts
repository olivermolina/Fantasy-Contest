import { AppSettings } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { isAuthenticated } from '../middleware/isAuthenticated';

/**
 * Fetches app settings and user settings
 * @param userId authenticated user id
 */
const getData = async (userId: string | undefined) => {
  const [appSettings, userAppSettings, user] = await prisma.$transaction([
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
  ]);

  if (!appSettings || !user) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Could not find app settings',
    });
  }
  return [appSettings, userAppSettings, user] as [
    typeof appSettings,
    typeof userAppSettings,
    typeof user,
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
  // TODO: are all of these settings OK to be public? @olivermolina
  const [appSettings, userAppSettings, user] = await getData(userId);
  return {
    user,
    allAppSettings: appSettings,
    userAppSettings: appSettings.map(
      overrideValues(
        // TODO: when user level app settings are created override them here
        userAppSettings,
      ),
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
      message: 'You must be logged in to get user settings.',
    });
  }
  return (await getUserSettings(userId)).userAppSettings;
});
