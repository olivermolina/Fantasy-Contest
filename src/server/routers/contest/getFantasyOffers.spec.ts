import prisma from '~/server/prisma';
import { League, Status } from '@prisma/client';
import { getFantasyOffers } from './getFantasyOffers';

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
            home: {
              code: 'SAC',
            },
            away: {
              code: 'PHX',
            },
          },
          odds: 100,
          type: 'PP',
          over: 100,
          under: -100,
          active: true,
        },
        {
          id: '25611-81-8986',
          player: {
            headshot: 'https://evanalytics.com/images/nba/SAC.png',
            position: 'G',
            team: 'Sacramento Kings',
            home: {
              code: 'SAC',
            },
            away: {
              code: 'PHX',
            },
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
            home: {
              code: 'SAC',
            },
            away: {
              code: 'PHX',
            },
          },
          odds: 100,
          type: 'PP',
          over: 160,
          under: -100,
          active: false,
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
            home: {
              code: 'SAC',
            },
            away: {
              code: 'PHX',
            },
          },
          odds: 100,
          type: 'PP',
          over: 100,
          under: -160,
          active: false,
        },
      ]),
    },
  };
});

describe('getFantasyOffers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return markets with active status', async () => {
    const fantasyOffers = await getFantasyOffers(League.NBA);
    expect(prisma.market.findMany).toHaveBeenCalledWith({
      where: {
        offer: {
          league: League.NBA,
          status: Status.Scheduled,
        },
        active: true,
      },
      include: {
        offer: {
          include: {
            TournamentEvent: true,
            home: true,
            away: true,
          },
        },
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
        MarketOverride: true,
      },
    });

    expect(fantasyOffers).toHaveLength(1);
  });

  it('should return all markets ', async () => {
    const fantasyOffers = await getFantasyOffers(League.NBA, true);
    expect(prisma.market.findMany).toHaveBeenCalledWith({
      where: {
        offer: {
          league: League.NBA,
          status: Status.Scheduled,
        },
      },
      include: {
        offer: {
          include: {
            TournamentEvent: true,
            home: true,
            away: true,
          },
        },
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
        MarketOverride: true,
      },
    });

    expect(fantasyOffers).toHaveLength(3);
  });

  it('should return filtered markets by odds range ', async () => {
    const oddsRange = {
      min: -200,
      max: 200,
    };
    const fantasyOffers = await getFantasyOffers(League.NBA, true, oddsRange);
    expect(prisma.market.findMany).toHaveBeenCalledWith({
      where: {
        offer: {
          league: League.NBA,
          status: Status.Scheduled,
        },
        over: { gte: oddsRange.min, lte: oddsRange.max },
        under: { gte: oddsRange.min, lte: oddsRange.max },
      },
      include: {
        offer: {
          include: {
            TournamentEvent: true,
            home: true,
            away: true,
          },
        },
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
        MarketOverride: true,
      },
    });

    expect(fantasyOffers).toHaveLength(3);
  });
});
