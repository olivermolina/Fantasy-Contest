import { t } from '~/server/trpc';
import prisma from '~/server/prisma';
import { AppSettingName } from '@prisma/client';

export const contentList = t.procedure.query(async () => {
  return await prisma.appSettings.findMany({
    where: {
      name: {
        in: [
          AppSettingName.CHALLENGE_PROMO_MESSAGE,
          AppSettingName.REFERRAL_CUSTOM_TEXT,
          AppSettingName.HOMEPAGE_HEADING_1,
          AppSettingName.HOMEPAGE_HEADING_2,
        ],
      },
    },
  });
});
