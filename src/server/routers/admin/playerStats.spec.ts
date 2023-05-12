import { getPlayerStats } from './playerStats';
import { contextMock } from '~/server/routers/admin/figures/weeklyBalances/__mocks__/contextMock';

/**
 * Mock out the prisma call
 */
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      findMany: jest.fn(() => []),
    },
    $transaction: jest.fn(() => []),
  })),
}));

describe('playerStats', () => {
  it('should return player stats', async () => {
    const players = await getPlayerStats({
      from: new Date('2022-11-14T06:00:00.000Z'),
      to: new Date('2023-03-02T06:00:00.000Z'),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ctx: contextMock,
    });
    expect(players).toEqual([]);
  });
});
