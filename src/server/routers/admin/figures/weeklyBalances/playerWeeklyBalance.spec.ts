import { playerWeeklyBalance } from './playerWeeklyBalance';
import { playerMock } from './__mocks__/playerMock';

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
    const dateRange = {
      from: '2023-01-30',
      to: '2023-02-05',
    };

    const balance = await playerWeeklyBalance({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      player: playerMock,
      dateRange,
      includeEntryFee: true,
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

  it('should return player weekly balance without entry fee', async () => {
    const dateRange = {
      from: '2023-01-30',
      to: '2023-02-05',
    };

    const balance = await playerWeeklyBalance({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      player: playerMock,
      dateRange,
      includeEntryFee: false,
    });

    expect(balance).toEqual({
      mondayBalance: 10,
      tuesdayBalance: -5,
      wednesdayBalance: -40,
      thursdayBalance: 0,
      fridayBalance: 0,
      saturdayBalance: 0,
      sundayBalance: 20,
      totalWeekBalance: -15,
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
