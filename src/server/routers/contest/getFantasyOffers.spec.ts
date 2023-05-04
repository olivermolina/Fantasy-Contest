import prisma from '~/server/prisma';
import { League, Status } from '@prisma/client';
import { getFantasyOffers } from './getFantasyOffers';

jest.mock('./getMarketOddsRange', () => {
  return {
    getMarketOddsRange: jest.fn().mockReturnValue({
      MIN: -150,
      MAX: 150,
    }),
  };
});

jest.mock('~/server/prisma', () => {
  return {
    market: {
      findMany: jest.fn().mockReturnValue([
        {
          id: '25611-81-8986',
          player: {
            headshot: 'https://evanalytics.com/images/nba/SAC.png',
            position: 'G',
            team: 'Sacramento Kings',
          },
          category: 'Assists',
          total: 6.5,
          matchup: 'SAC @ PHX',
          name: "De'Aaron Fox",
          tags: [],
          selId: 8986,
          offer: {
            league: 'NBA',
            gamedate: 'Feb 14, 2999',
            gametime: '09:00 PM UTC',
          },
          odds: 100,
          type: 'PP',
          over: 100,
          under: -100,
        },
        {
          id: '25611-81-8986',
          player: {
            headshot: 'https://evanalytics.com/images/nba/SAC.png',
            position: 'G',
            team: 'Sacramento Kings',
          },
          category: 'Assists',
          total: 6.5,
          matchup: 'SAC @ PHX',
          name: "De'Aaron Fox",
          tags: [],
          selId: 8986,
          offer: {
            league: 'NBA',
            gamedate: 'Feb 14, 2999',
            gametime: '09:00 PM UTC',
          },
          odds: 100,
          type: 'PP',
          over: 160,
          under: -100,
        },
        {
          id: '25611-81-8986',
          player: {
            headshot: 'https://evanalytics.com/images/nba/SAC.png',
            position: 'G',
            team: 'Sacramento Kings',
          },
          category: 'Assists',
          total: 6.5,
          matchup: 'SAC @ PHX',
          name: "De'Aaron Fox",
          tags: [],
          selId: 8986,
          offer: {
            league: 'NBA',
            gamedate: 'Feb 14, 2999',
            gametime: '09:00 PM UTC',
          },
          odds: 100,
          type: 'PP',
          over: 100,
          under: -160,
        },
      ]),
    },
  };
});

describe('getFantasyOffers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return markets with over and under odds between -150 to +150', async () => {
    const fantasyOffers = await getFantasyOffers(League.NBA);
    expect(prisma.market.findMany).toHaveBeenCalledWith({
      where: {
        offer: {
          league: League.NBA,
          status: Status.Scheduled,
        },
        over: {
          gte: -150,
          lte: 150,
        },
        under: {
          gte: -150,
          lte: 150,
        },
      },
      include: {
        offer: true,
        player: true,
        FreeSquare: {
          include: {
            FreeSquareContestCategory: {
              include: {
                contestCategory: true,
              },
            },
          },
        },
      },
    });

    expect(fantasyOffers).toHaveLength(1);
  });
});
