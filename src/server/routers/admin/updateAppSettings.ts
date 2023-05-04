import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { z } from 'zod';
import { AppSettingName } from '@prisma/client';

const updateAppSettings = adminProcedure
  .input(
    z.array(
      z.object({
        appSettingName: z.string(),
        value: z.string(),
      }),
    ),
  )
  .mutation(async ({ input }) => {
    return await prisma.$transaction(
      input.map((appSetting) =>
        prisma.appSettings.upsert({
          where: {
            name: appSetting.appSettingName as AppSettingName,
          },
          create: {
            name: appSetting.appSettingName as AppSettingName,
            value: appSetting.value,
          },
          update: {
            name: appSetting.appSettingName as AppSettingName,
            value: appSetting.value,
          },
        }),
      ),
    );
  });

export default updateAppSettings;
