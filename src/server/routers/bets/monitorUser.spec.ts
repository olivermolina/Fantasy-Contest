import { monitorUser } from './monitorUser';
import { TRPCError } from '@trpc/server';
import { userMock } from '~/server/routers/bets/__mocks__/user.mock';
import { betMock } from '~/server/routers/bets/__mocks__/bet.mock';

jest.mock('~/server/prisma', () => {
  return {
    session: {
      create: jest.fn().mockReturnValueOnce({
        id: 'session-id',
        created_at: new Date(),
        userId: 'user-id',
        completeSessionRequestRaw: '',
        sessionRequestRaw: '',
        deviceLocation: '',
        serviceType: 'PLACE_BET',
      }),
    },
  };
});

jest.mock('~/server/routers/contest/specialRestrictions', () => {
  return jest.fn(() => undefined);
});

jest.mock('~/lib/tsevo-gidx/GIDX', () => {
  return jest.fn().mockImplementation(() => {
    return {
      customerMonitor: jest
        .fn()
        .mockReturnValueOnce({ ReasonCodes: ['ID-VERIFIED'] }),
    };
  });
});

describe('monitorUser', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not throw an error if user is verified', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await expect(async () => await monitorUser(betMock, userMock)).not.toThrow(
      TRPCError,
    );
  });

  // TODO test should throw an error if user is blocked
});
