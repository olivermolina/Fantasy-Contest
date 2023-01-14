import { AppRouter, appRouter } from '~/server/routers/_app';
import { inferProcedureInput, TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { supabase } from '~/utils/supabaseTestClient';

describe('Test user signup', () => {
  const caller = appRouter.createCaller({} as any);
  const testEmail = 'unitestemail@test.com';
  const testPassword = '12345678';
  const userInput: inferProcedureInput<AppRouter['user']['signUp']> = {
    email: testEmail,
    username: 'test',
    state: 'Test',
    phone: '12341231',
    DOB: new Date(),
    password: testPassword,
    confirmPassword: testPassword,
    referralCode: '',
  };
  afterEach(async () => {
    const result = await supabase.auth.signIn({
      email: testEmail,
      password: testPassword,
    });
    const userId = result.user?.id;

    if (userId) {
      const userContestEntry = await prisma.contestEntry.findFirst({
        where: {
          userId: userId,
        },
      });
      await prisma.contestEntry.delete({
        where: {
          id: userContestEntry?.id,
        },
      });
      const userWallet = await prisma.wallets.findFirst({
        where: {
          userId: userId,
        },
      });

      await prisma.wallets.delete({
        where: {
          id: userWallet?.id,
        },
      });

      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      await supabase.auth.api.deleteUser(userId);
    }
  }, 100000);
  it('should not throw an error if referral is empty', async () => {
    await expect(caller.user.signUp(userInput)).resolves.not.toThrow(TRPCError);
  }, 100000);
  it('should throw duplicate signup error', async () => {
    await caller.user.signUp(userInput);
    await expect(caller.user.signUp(userInput)).rejects.toThrow(TRPCError);
  }, 100000);
});
