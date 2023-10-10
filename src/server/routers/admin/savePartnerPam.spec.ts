import { innerFn } from './savePartnerPam';
import { UserType } from '@prisma/client';
import { NEW_USER_ID } from '~/constants/NewUserId';

jest.mock('~/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest
        .fn()
        .mockResolvedValue({ data: { user: { id: 'new_user_id' } } }),
    },
  },
}));

jest.mock('~/server/prisma', () => {
  return {
    user: {
      update: jest.fn().mockResolvedValue({
        id: 'existing_user_id',
        email: 'test@example.com',
        status: 'ACTIVE',
      }),
      create: jest.fn().mockResolvedValue({
        id: 'new_user_id',
        email: 'test@example.com',
        username: 'testuser',
        phone: '1234567890',
        type: 'AGENT',
      }),
    },
    agent: {
      upsert: jest.fn().mockResolvedValue({
        id: 'existing_user_id',
      }),
    },
    agentSubAdmin: {
      deleteMany: jest.fn(),
    },
  };
});

describe('savePartnerPam', () => {
  it('should save a new partner or PAM', async () => {
    const input = {
      id: NEW_USER_ID,
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      phone: '1234567890',
      type: UserType.AGENT,
      subAdminId: 'subadmin123',
    };

    const prismaUser = {
      id: 'new_user_id',
      email: 'test@example.com',
      phone: '1234567890',
      username: 'testuser',
      type: 'AGENT',
    };

    const result = await innerFn({ input });

    expect(result).toEqual(prismaUser);
  });

  it('should update an existing partner or PAM', async () => {
    const input = {
      id: 'existing_user_id',
      email: 'test@example.com',
      status: true,
      password: 'password123',
      username: 'testuser',
      phone: '1234567890',
      type: UserType.AGENT,
      subAdminId: 'subadmin123',
    };

    const prismaUser = {
      id: input.id,
      email: input.email,
      status: input.status ? 'ACTIVE' : 'INACTIVE',
    };
    const result = await innerFn({ input });
    expect(result).toEqual(prismaUser);
  });
});
