import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { z } from 'zod';
import { AppSettingName, Status } from '@prisma/client';
import { getMarketOddsRange } from '~/server/routers/contest/getMarketOddsRange';

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
    const maxOdds = input.find(
      (appSetting) =>
        appSetting.appSettingName === AppSettingName.MAX_MARKET_ODDS,
    );
    const minOdds = input.find(
      (appSetting) =>
        appSetting.appSettingName === AppSettingName.MIN_MARKET_ODDS,
    );
    const marketOddsRange = await getMarketOddsRange();
    const max = maxOdds ? Number(maxOdds?.value) : marketOddsRange.MAX;
    const min = minOdds ? Number(minOdds?.value) : marketOddsRange.MIN;

    return await prisma.$transaction([
      ...input.map((appSetting) =>
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

      // Activate all the markets that are scheduled and are not manually entered and are in the range
      prisma.market.updateMany({
        where: {
          offer: {
            status: Status.Scheduled,
            manualEntry: false,
          },
          over: {
            gte: min,
            lte: max,
          },
          under: {
            gte: min,
            lte: max,
          },
          active: false,
        },
        data: {
          active: true,
        },
      }),

      // Suspend all the markets that are scheduled and are not manually entered and are not in the range
      prisma.market.updateMany({
        where: {
          offer: {
            status: Status.Scheduled,
            manualEntry: false,
          },
          OR: [
            {
              over: {
                gt: max,
              },
            },
            {
              over: {
                lt: min,
              },
            },
            {
              under: {
                gt: max,
              },
            },
            {
              under: {
                lt: min,
              },
            },
          ],
          active: true,
        },
        data: {
          active: false,
        },
      }),
    ]);
  });

export default updateAppSettings;
