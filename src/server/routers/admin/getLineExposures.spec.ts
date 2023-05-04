import prisma from '~/server/prisma';
import { League, MarketType } from '@prisma/client';
import { innerFn as getLineExposures } from './getLineExposures';
import { getDateStringRangeList } from '~/utils/getDateStringRangeList';

jest.mock('~/server/prisma', () => {
  return {
    market: {
      findMany: jest.fn().mockReturnValue([
        {
          id: 'market-1',
          name: 'Chris Paul',
          category: 'Assists',
          total: 10,
          over: 100,
          under: -110,
          type: 'PP',
          BetLeg: [
            {
              id: 'leg-1',
              betId: 'bet-1',
              type: 'OVER_ODDS',
              Bet: {
                stake: 10,
                payout: 50,
                created_at: '2023-02-01',
                owner: {
                  id: 'user-1',
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
            },
            {
              id: 'leg-2',
              betId: 'bet-2',
              type: 'UNDER_ODDS',
              Bet: {
                stake: 10,
                payout: 50,
                created_at: '2023-02-01',
                owner: {
                  id: 'user-2',
                  firstName: 'John',
                  lastName: 'Wick',
                },
              },
            },
          ],
          offer: {
            id: 'offer-1',
            gamedate: '2023-02-01',
            gametime: '00:00:00',
            league: 'NBA',
            status: 'Scheduled',
          },
        },
        {
          id: 'market-2',
          name: 'Lebron James',
          category: 'Points',
          total: 35,
          over: -100,
          under: 110,
          type: 'PP',
          BetLeg: [
            {
              id: 'leg-1',
              betId: 'bet-1',
              type: 'OVER_ODDS',
              Bet: {
                stake: 10,
                payout: 50,
                created_at: '2023-02-01',
                owner: {
                  id: 'user-1',
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
            },
            {
              id: 'leg-2',
              betId: 'bet-2',
              type: 'UNDER_ODDS',
              Bet: {
                stake: 10,
                payout: 50,
                created_at: '2023-02-01',
                owner: {
                  id: 'user-2',
                  firstName: 'John',
                  lastName: 'Wick',
                },
              },
            },
          ],
          offer: {
            id: 'offer-1',
            gamedate: '2023-02-01',
            gametime: '00:00:00',
            league: 'NBA',
            status: 'Scheduled',
          },
        },

        {
          id: 'market-3',
          name: 'Jason Tatum',
          category: 'Points',
          total: 35,
          over: 100,
          under: -110,
          type: 'PP',
          BetLeg: [
            {
              id: 'leg-1',
              betId: 'bet-1',
              type: 'OVER_ODDS',
              Bet: {
                stake: 10,
                payout: 50,
                created_at: '2023-02-01',
                owner: {
                  id: 'user-1',
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
            },
            {
              id: 'leg-2',
              betId: 'bet-2',
              type: 'UNDER_ODDS',
              Bet: {
                stake: 10,
                payout: 50,
                created_at: '2023-02-01',
                owner: {
                  id: 'user-2',
                  firstName: 'John',
                  lastName: 'Wick',
                },
              },
            },
          ],
          offer: {
            id: 'offer-2',
            gamedate: '2023-02-01',
            gametime: '00:00:00',
            league: 'NBA',
            status: 'Scheduled',
          },
        },
        {
          id: 'market-4',
          name: 'Jaylen Brown',
          category: 'Assist',
          total: 5,
          over: -100,
          under: 110,
          type: 'PP',
          BetLeg: [
            {
              id: 'leg-1',
              betId: 'bet-1',
              type: 'OVER_ODDS',
              Bet: {
                stake: 10,
                payout: 50,
                created_at: '2023-02-01',
                owner: {
                  id: 'user-1',
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
            },
            {
              id: 'leg-2',
              betId: 'bet-2',
              type: 'UNDER_ODDS',
              Bet: {
                stake: 10,
                payout: 50,
                created_at: '2023-02-01',
                owner: {
                  id: 'user-2',
                  firstName: 'John',
                  lastName: 'Wick',
                },
              },
            },
          ],
          offer: {
            id: 'offer-2',
            gamedate: '2023-02-01',
            gametime: '00:00:00',
            league: 'NBA',
            status: 'Scheduled',
          },
        },
      ]),
    },
  };
});

describe('getLineExposures', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return line exposures', async () => {
    const input = {
      league: League.NBA,
      dateFrom: '2023-02-08',
      dateTo: '2023-02-01',
    };

    const result = await getLineExposures({
      input,
    });

    expect(prisma.market.findMany).toHaveBeenCalledWith({
      where: {
        type: MarketType.PP,
        NOT: {
          BetLeg: {
            none: {},
          },
        },
        offer: {
          league: input.league,
          gamedate: {
            in: getDateStringRangeList(
              new Date(input.dateFrom),
              new Date(input.dateTo),
            ),
          },
        },
      },
      include: {
        BetLeg: {
          include: {
            Bet: {
              include: {
                owner: true,
              },
            },
          },
        },
        offer: true,
      },
    });

    expect(result).toHaveLength(4);
  });
});
