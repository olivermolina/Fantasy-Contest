import prisma from '~/server/prisma';
import { UserType } from '@prisma/client';
import { innerFn as weeklyBalances } from './weeklyBalances';
import { playerWeeklyBalance } from './playerWeeklyBalance';
import { contextMock } from '~/server/routers/admin/figures/weeklyBalances/__mocks__/contextMock';

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
      },
    });
    const dateRange = {
      from: '2023-01-30',
      to: '2023-02-05',
    };

    expect(playerWeeklyBalance).toHaveBeenCalledWith({
      player,
      dateRange,
    });
    expect(playerWeeklyBalance).toBeCalledTimes(1);
    expect(result).toHaveProperty('dateRange', dateRange);
  });
});
