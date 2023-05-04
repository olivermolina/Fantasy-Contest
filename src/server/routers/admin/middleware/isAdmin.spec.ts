import { middlewareFn } from './isAdmin';

describe('isAdmin', () => {
  it('should check a users role and throw an error if not an admin', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    jest.spyOn(require('./getUser'), 'getUser').mockResolvedValue({
      isAdmin: false,
    });
    expect(
      middlewareFn({
        ctx: {
          session: {
            user: null,
          },
        },
      } as any),
    ).rejects.toThrowError();
  });
  it('should check a users role and throw an error if not logged in', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    jest.spyOn(require('./getUser'), 'getUser').mockResolvedValue(null);
    expect(
      middlewareFn({
        ctx: {
          session: {
            user: null,
          },
        },
      } as any),
    ).rejects.toThrowError();
  });
  it('should add a user object to the context', async () => {
    const user = {
      first: 'test',
      isAdmin: true,
    };
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    jest.spyOn(require('./getUser'), 'getUser').mockResolvedValue(user);
    const nextFn = jest.fn();
    await middlewareFn({
      ctx: {
        session: {
          user: null,
        },
      },
      next: nextFn,
    } as any);
    expect(nextFn).toBeCalledWith(
      expect.objectContaining({
        ctx: expect.objectContaining({
          user,
        }),
      }),
    );
  });
});
