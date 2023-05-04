import { prismaMock } from '~/server/singleton';
import { AppRouter, appRouter } from '~/server/routers/_app';
import { inferProcedureInput, TRPCError } from '@trpc/server';
import { TransactionType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createTransaction } from '~/server/routers/bets/createTransaction';

jest.mock('~/server/routers/bets/createTransaction', () => ({
  createTransaction: jest.fn(),
}));
describe('addRemoveWithdrawable', () => {
  const adminId = faker.datatype.uuid();

  const caller = appRouter.createCaller({
    session: { user: { id: adminId } },
  } as any);

  beforeEach(() => {
    prismaMock.user.findUnique.mockResolvedValue(null);
  });

  it('should throw an error if user not found', async () => {
    const input: inferProcedureInput<
      AppRouter['user']['addRemoveWithdrawable']
    > = {
      userId: '1',
      amount: 2,
      transactionType: TransactionType.CREDIT,
    };
    await expect(caller.user.addRemoveWithdrawable(input)).rejects.toThrow(
      TRPCError,
    );
  });
  it('should throw an error if user is not and admin', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    prismaMock.user.findUnique.mockResolvedValue({
      id: adminId,
      email: faker.internet.email(),
      username: faker.internet.userName(),
      DOB: new Date('1996-12-16T00:00:00.000Z'),
      isFirstDeposit: false,
      referral: null,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      postalCode: faker.address.zipCode(),
      identityStatus: true,
      reasonCodes: ['ID-VERIFIED', 'LL-GEO-US-NJ'],
      isAdmin: false,
      phone: null,
    });

    const input: inferProcedureInput<
      AppRouter['user']['addRemoveWithdrawable']
    > = {
      userId: '1',
      amount: 2,
      transactionType: TransactionType.CREDIT,
    };
    await expect(caller.user.addRemoveWithdrawable(input)).rejects.toThrow(
      TRPCError,
    );
  });
  it('should not throw an error if user is admin', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    prismaMock.user.findUnique.mockResolvedValue({
      id: adminId,
      email: faker.internet.email(),
      username: faker.internet.userName(),
      DOB: new Date('1996-12-16T00:00:00.000Z'),
      isFirstDeposit: false,
      referral: null,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      postalCode: faker.address.zipCode(),
      identityStatus: true,
      reasonCodes: ['ID-VERIFIED', 'LL-GEO-US-NJ'],
      isAdmin: true,
      phone: null,
    });

    const input: inferProcedureInput<
      AppRouter['user']['addRemoveWithdrawable']
    > = {
      userId: '1',
      amount: 2,
      transactionType: TransactionType.CREDIT,
    };

    await expect(caller.user.addRemoveWithdrawable(input)).resolves.not.toThrow(
      TRPCError,
    );
    expect(createTransaction).toHaveBeenCalledTimes(1);
  });
});
