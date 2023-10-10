import prisma from '~/server/prisma';
import { BetStatus, UserType } from '@prisma/client';
import { innerFn as weeklyBalances } from './weeklyBalances';
import { playerWeeklyBalance } from './playerWeeklyBalance';
import { contextMock } from '~/server/routers/admin/figures/weeklyBalances/__mocks__/contextMock';
import { ActionType } from '~/constants/ActionType';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';

jest.mock('~/server/prisma', () => {
  return {
    user: {
      findMany: jest.fn().mockReturnValue([
        {
          id: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
          email: 'danielgroup12@gmail.com',
          username: 'Danielgroup12',
          DOB: new Date('1996-12-16T00:00:00.000Z'),
          isFirstDeposit: false,
          referral: null,
          firstname: 'DANIEL',
          lastname: 'GROUP',
          address1: '60 12th st,',
          address2: '6C',
          city: 'Hoboken',
          state: 'NJ',
          postalCode: '07030',
          identityStatus: true,
          reasonCodes: ['ID-VERIFIED', 'LL-GEO-US-NJ'],
          isAdmin: false,
          phone: null,
          type: 'PLAYER',
          agentId: null,
          Bets: [{ status: 'WIN', amount: 100 }],
          Transactions: [{ amount: 100, status: 'COMPLETE' }],
        },
      ]),
    },
  };
});

jest.mock('./playerWeeklyBalance', () => ({
  playerWeeklyBalance: jest.fn().mockReturnValue([]),
}));

jest.mock('~/server/routers/user/linkUserToAgent', () => ({
  linkUserToAgent: jest.fn(),
}));

describe('weeklyBalances', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queries the players weekly balance and calls getPlayerWeeklyBalance', async () => {
    const reportDate = '2023-02-01';
    const result = await weeklyBalances({
      input: {
        date: reportDate,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ctx: contextMock,
    });

    const dateRange = {
      from: '2023-01-30',
      to: '2023-02-05',
    };
    const dateRangeInput = {
      gte: new Date('2023-01-30T05:00:00.000Z'),
      lte: new Date('2023-02-06T05:00:00.000Z'),
    };

    const player = {
      id: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
      email: 'danielgroup12@gmail.com',
      username: 'Danielgroup12',
      DOB: new Date('1996-12-16T00:00:00.000Z'),
      isFirstDeposit: false,
      referral: null,
      firstname: 'DANIEL',
      lastname: 'GROUP',
      address1: '60 12th st,',
      address2: '6C',
      city: 'Hoboken',
      state: 'NJ',
      postalCode: '07030',
      identityStatus: true,
      reasonCodes: ['ID-VERIFIED', 'LL-GEO-US-NJ'],
      isAdmin: false,
      phone: null,
      type: 'PLAYER',
      agentId: null,
      Bets: [{ status: 'WIN', amount: 100 }],
      Transactions: [{ amount: 100, status: 'COMPLETE' }],
    };

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {
        type: UserType.PLAYER,
        NOT: {
          id: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
        },
      },
      include: {
        agent: {
          include: { User: true },
        },
        Bets: {
          where: {
            OR: [
              {
                status: BetStatus.PENDING,
              },
              {
                updated_at: dateRangeInput,
                status: {
                  in: [BetStatus.WIN, BetStatus.LOSS],
                },
              },
            ],
          },
        },
        Transactions: {
          where: {
            actionType: {
              in: [ActionType.PAY, ActionType.PAYOUT],
            },
            created_at: dateRangeInput,
            TransactionStatuses: {
              every: {
                statusCode: {
                  in: [PaymentStatusCode.PENDING, PaymentStatusCode.COMPLETE],
                },
              },
            },
            NOT: {
              TransactionStatuses: {
                none: {},
              },
            },
          },
          include: {
            TransactionStatuses: true,
          },
        },
      },
    });

    expect(playerWeeklyBalance).toHaveBeenCalledWith({
      player,
      dateRange,
    });
    expect(playerWeeklyBalance).toBeCalledTimes(1);
    expect(result).toHaveProperty('dateRange', dateRange);
  });
});
