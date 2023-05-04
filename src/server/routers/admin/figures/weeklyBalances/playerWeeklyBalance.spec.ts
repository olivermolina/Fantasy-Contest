import prisma from '~/server/prisma';
import { playerWeeklyBalance } from './playerWeeklyBalance';
import { BetStatus } from '@prisma/client';
import dayjs from 'dayjs';

jest.mock('~/server/prisma', () => {
  return {
    bet: {
      findMany: jest.fn().mockReturnValue([
        {
          id: 'bet-1',
          userId: 'player-id',
          created_at: new Date('2023-01-30'),
          updated_at: new Date('2023-01-30'),
          status: 'WIN',
          stake: 10,
          payout: 30,
          bonusCreditStake: 0,
        },
        {
          id: 'bet-1',
          userId: 'player-id',
          created_at: new Date('2023-01-30'),
          updated_at: new Date('2023-01-30'),
          status: 'LOSS',
          stake: 10,
          payout: 15,
          bonusCreditStake: 0,
        },
        {
          id: 'bet-2',
          userId: 'player-id',
          created_at: new Date('2023-01-31'),
          updated_at: new Date('2023-01-31'),
          status: 'WIN',
          stake: 5,
          payout: 50,
          bonusCreditStake: 0,
        },
        {
          id: 'bet-3',
          userId: 'player-id',
          created_at: new Date('2023-01-31'),
          updated_at: new Date('2023-01-31'),
          status: 'LOSS',
          stake: 50,
          payout: 250,
          bonusCreditStake: 0,
        },
        {
          id: 'bet-4',
          userId: 'player-id',
          created_at: new Date('2023-02-01'),
          updated_at: new Date('2023-02-01'),
          status: 'WIN',
          stake: 5,
          payout: 15,
          bonusCreditStake: 0,
        },
        {
          id: 'bet-4',
          userId: 'player-id',
          created_at: new Date('2023-02-01'),
          updated_at: new Date('2023-02-01'),
          status: 'LOSS',
          stake: 50,
          payout: 30,
          bonusCreditStake: 0,
        },
        {
          id: 'bet-5',
          userId: 'player-id',
          created_at: new Date('2023-02-03'),
          updated_at: new Date('2023-02-03'),
          status: 'PENDING',
          stake: 10,
          payout: 30,
          bonusCreditStake: 0,
        },
        {
          id: 'bet-6',
          userId: 'player-id',
          created_at: new Date('2023-02-04'),
          updated_at: new Date('2023-02-04'),
          status: 'PENDING',
          stake: 10,
          payout: 30,
          bonusCreditStake: 0,
        },
        {
          id: 'bet-7',
          userId: 'player-id',
          created_at: new Date('2023-02-05'),
          updated_at: new Date('2023-02-05'),
          status: 'CANCELLED',
          stake: 10,
          payout: 30,
          bonusCreditStake: 0,
        },
        {
          id: 'bet-8',
          userId: 'player-id',
          created_at: new Date('2023-02-05'),
          updated_at: new Date('2023-02-05'),
          status: 'REFUNDED',
          stake: 10,
          payout: 30,
          bonusCreditStake: 0,
        },
      ]),
    },
    transaction: {
      findMany: jest.fn().mockReturnValue([
        {
          id: 'trans-1',
          userId: 'player-id',
          created_at: new Date('2023-02-01'),
          amountProcess: 50,
          actionType: 'PAY',
          TransactionStatuses: [
            {
              id: 'trans-status-1',
              statusCode: 1, // COMPLETED
            },
          ],
        },
        {
          id: 'trans-2',
          userId: 'player-id',
          created_at: new Date('2023-02-01'),
          amountProcess: 10,
          actionType: 'PAY',
          TransactionStatuses: [
            {
              id: 'trans-status-1',
              statusCode: 0, // PENDING
            },
          ],
        },
        {
          id: 'trans-3',
          userId: 'player-id',
          created_at: new Date('2023-02-01'),
          amountProcess: 50,
          actionType: 'PAY',
          TransactionStatuses: [
            {
              id: 'trans-status-1',
              statusCode: 3, // Failed
            },
          ],
        },
        {
          id: 'trans-3',
          userId: 'player-id',
          created_at: new Date('2023-02-01'),
          amountProcess: 1,
          actionType: 'PAYOUT',
          TransactionStatuses: [
            {
              id: 'trans-status-2',
              statusCode: 1, // COMPLETED
            },
          ],
        },
        {
          id: 'trans-3',
          userId: 'player-id',
          created_at: new Date('2023-02-01'),
          amountProcess: 5,
          actionType: 'PAYOUT',
          TransactionStatuses: [
            {
              id: 'trans-status-2',
              statusCode: 0, // PENDING
            },
          ],
        },
        {
          id: 'trans-4',
          userId: 'player-id',
          created_at: new Date('2023-02-01'),
          amountProcess: 10,
          actionType: 'PAYOUT',
          TransactionStatuses: [
            {
              id: 'trans-status-3',
              statusCode: 3, // FAILED
            },
          ],
        },
      ]),
    },
  };
});

jest.mock('~/server/routers/user/userTotalBalance', () => ({
  getUserTotalBalance: jest.fn().mockReturnValue({
    totalAmount: 0,
    totalCashAmount: 0,
    creditAmount: 0,
    unPlayedAmount: 0,
    withdrawableAmount: 0,
  }),
}));

describe('playerWeeklyBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return player weekly balance with correct week dates', async () => {
    const playerId = 'player-id';
    const dateRange = {
      from: '2023-01-30',
      to: '2023-02-05',
    };
    const balance = await playerWeeklyBalance({
      player: {
        id: playerId,
        username: 'Danielgroup12',
        firstname: 'DANIEL',
        lastname: 'GROUP',
        agent: null,
        isFirstDeposit: false,
      },
      dateRange,
    });

    expect(prisma.bet.findMany).toHaveBeenCalledWith({
      where: {
        userId: playerId,
        updated_at: {
          gte: dayjs(`${dateRange.from}`).tz('America/New_York').toDate(),
          lte: dayjs(`${dateRange.to} `).tz('America/New_York').toDate(),
        },
        NOT: {
          status: BetStatus.PENDING,
        },
      },
    });
    expect(balance).toEqual({
      mondayBalance: 20,
      tuesdayBalance: 0,
      wednesdayBalance: -35,
      thursdayBalance: 0,
      fridayBalance: 0,
      saturdayBalance: 0,
      sundayBalance: 20,
      totalWeekBalance: 5,
      deposits: 50,
      withdrawals: 6,
      pendingTotal: 20,
      cashAmount: 0,
      withdrawable: 0,
      creditAmount: 0,
      totalBalance: 0,
      isActive: true,
    });
  });
});
