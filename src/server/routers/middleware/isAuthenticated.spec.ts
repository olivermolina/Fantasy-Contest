import { middlewareFn } from './isAuthenticated';

describe('middlewareFn', () => {
  it('should throw an error if the user is not authenticated', async () => {
    const input = {
      ctx: {
        session: {
          user: null,
        },
      },
    } as any;

    await expect(middlewareFn(input)).rejects.toThrowError(
      'You must be authenticated to access this function.',
    );
  });

  it('should not throw an error if the user is authenticated', async () => {
    const ctx = {
      ctx: {
        session: {
          user: {
            id: 1,
          },
        },
      },
      next: jest.fn(),
    } as any;

    await expect(middlewareFn(ctx)).resolves.not.toThrowError();
  });
});
