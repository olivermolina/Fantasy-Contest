import { getPlayerStats } from './playerStats';

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
    });
    expect(players).toEqual([]);
  });
});
