import prisma from '~/server/prisma';
import { AppSettingName } from '@prisma/client';
import { MarketOddsRange } from '~/constants/MarketOddsRange';
import { appNodeCache } from '~/lib/node-cache/AppNodeCache';
import { AppNodeCacheEnum } from '~/lib/node-cache/AppNodeCacheEnum';

export interface MarketOddsRangeInterface {
  MIN: number;
  MAX: number;
}

/**
 * This function will get the market odds range for fantasy offers
 * by default the range is set from -150 to +150
 */
export const getMarketOddsRange = async () => {
  const marketRangeCache = appNodeCache.get(AppNodeCacheEnum.MARKET_ODDS_RANGE);
  if (marketRangeCache) {
    return marketRangeCache as MarketOddsRangeInterface;
  }

  const appSettings = await prisma.appSettings.findMany();
  const min = appSettings.find(
    (appSetting) => appSetting.name === AppSettingName.MIN_MARKET_ODDS,
  );
  const max = appSettings.find(
    (appSetting) => appSetting.name === AppSettingName.MAX_MARKET_ODDS,
  );

  const marketOddsRange = {
    MIN: Number(min?.value) || MarketOddsRange.MIN,
    MAX: Number(max?.value) || MarketOddsRange.MAX,
  };

  const ONE_DAY_SECONDS = 60 * 60 * 24;
  appNodeCache.set(
    AppNodeCacheEnum.MARKET_ODDS_RANGE,
    marketOddsRange,
    ONE_DAY_SECONDS,
  );

  return marketOddsRange;
};
