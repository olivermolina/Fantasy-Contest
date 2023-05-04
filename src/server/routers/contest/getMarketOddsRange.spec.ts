import { prismaMock } from '~/server/singleton';
import { AppSettingName } from '@prisma/client';
import { getMarketOddsRange } from './getMarketOddsRange';

jest.mock('~/lib/node-cache/AppNodeCache', () => {
  return {
    appNodeCache: {
      get: jest.fn().mockReturnValue(null),
      set: jest.fn(),
    },
  };
});

describe('getMarketOddsRange', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return markets odds range between -150 to +150 if the AppSettings is not set', async () => {
    prismaMock.appSettings.findMany.mockResolvedValue([]);
    const marketOddsRange = await getMarketOddsRange();

    expect(marketOddsRange).toEqual({
      MIN: -150,
      MAX: 150,
    });
  });

  it('should return AppSettings markets odds range if set', async () => {
    prismaMock.appSettings.findMany.mockResolvedValue([
      {
        id: '1',
        name: AppSettingName.MIN_MARKET_ODDS,
        value: '-130',
      },
      {
        id: '2',
        name: AppSettingName.MAX_MARKET_ODDS,
        value: '130',
      },
    ]);
    const marketOddsRange = await getMarketOddsRange();

    expect(marketOddsRange).toEqual({
      MIN: -130,
      MAX: 130,
    });
  });
});
