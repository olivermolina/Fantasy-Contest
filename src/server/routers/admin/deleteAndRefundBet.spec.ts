import prisma from '~/server/prisma';
import { BetStatus } from '@prisma/client';
import { settleBet } from '../bets/grade';
import { innerFn as deleteAndRefundBet } from './deleteAndRefundBet';

jest.mock('~/server/prisma', () => {
  return {
    bet: {
      update: jest.fn().mockReturnValue({
        id: 'bet-id',
        status: 'PUSH',
        legs: [
          {
            id: 'leg-id',
            status: 'REFUNDED',
          },
        ],
        ContestEntries: [
          {
            contest: {
              id: 'contest-id',
              prizePool: 100,
            },
          },
        ],
        ContestCategory: {
          id: 'contest-category-id',
        },
      }),
    },
  };
});

jest.mock('../bets/grade', () => {
  return {
    settleBet: jest.fn(),
  };
});

describe('deleteAndRefundBet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates the bet and its legs and calls settleBet', async () => {
    const betId = 'bet-id';

    await deleteAndRefundBet({
      input: {
        betId,
      },
    });

    expect(prisma.bet.update).toHaveBeenCalledWith({
      where: {
        id: betId,
      },
      data: {
        status: BetStatus.REFUNDED,
        legs: {
          updateMany: {
            where: {
              betId,
            },
            data: {
              status: BetStatus.REFUNDED,
            },
          },
        },
      },
      include: {
        legs: true,
        ContestEntries: {
          include: {
            contest: true,
          },
        },
        ContestCategory: true,
      },
    });

    expect(settleBet).toHaveBeenCalledWith({
      id: 'bet-id',
      status: BetStatus.PUSH,
      legs: [
        {
          id: 'leg-id',
          status: BetStatus.REFUNDED,
        },
      ],
      ContestEntries: [
        {
          contest: {
            id: 'contest-id',
            prizePool: 100,
          },
        },
      ],
      ContestCategory: {
        id: 'contest-category-id',
      },
    });
  });
});
