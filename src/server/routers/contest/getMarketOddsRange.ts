import prisma from '~/server/prisma';
import { AppSettingName } from '@prisma/client';
import { MarketOddsRange } from '~/constants/MarketOddsRange';

/**
 * This function will get the market odds range for fantasy offers
 * by default the range is set from -150 to +150
 */
export const getMarketOddsRange = async () => {
  const appSettings = await prisma.appSettings.findMany();
  const min = appSettings.find(
    (appSetting) => appSetting.name === AppSettingName.MIN_MARKET_ODDS,
  );
  const max = appSettings.find(
    (appSetting) => appSetting.name === AppSettingName.MAX_MARKET_ODDS,
  );

  return {
    MIN: Number(min?.value) || MarketOddsRange.MIN,
    MAX: Number(max?.value) || MarketOddsRange.MAX,
  };
};
