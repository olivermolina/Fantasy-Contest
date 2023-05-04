import { getUserTotalBalanceBatch } from './getUserTotalBalanceBatch';
import users from './__mocks__/users.json';

describe('getUserTotalBalanceBatch', () => {
  it('should return user total balance', async () => {
    const prismaClient = {
      user: {
        findMany: jest.fn().mockResolvedValue(users),
      },
    };
    const result = await getUserTotalBalanceBatch(
      [
        '2c1cbb95-5b1f-4bf5-8eda-dc5af334b77b',
        '39b1e5db-d375-4358-aec9-28ce971985de',
      ],
      prismaClient as any,
    );
    expect(result).toMatchSnapshot();
  });
});
