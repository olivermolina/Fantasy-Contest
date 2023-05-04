import { BetLegType, BetStakeType, BetType, League } from '@prisma/client';

export const betMock = {
  stake: 1,
  contestId: 'contest-id',
  type: BetType.PARLAY,
  legs: [
    {
      total: 1,
      marketId: 'market-id',
      marketSelId: 1,
      type: BetLegType.OVER_ODDS,
      league: League.NBA,
    },
  ],
  contestCategoryId: '12',
  stakeType: BetStakeType.INSURED,
  ipAddress: '1.1.1.1.1',
  deviceGPS: {
    Latitude: 0,
    Longitude: 0,
  },
};
