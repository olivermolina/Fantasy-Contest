import { prismaMock } from '~/server/singleton';
import { TRPCError } from '@trpc/server';
import { Prisma, TransactionType, PaymentMethodType } from '@prisma/client';
import getUserTotalBalance, {
  TransactionStatusWithTransaction,
} from './getUserTotalBalance';
import { ActionType } from '~/constants/ActionType';

describe('Test getUserTotalBalance', () => {
  beforeEach(() => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
      email: 'danielgroup12@gmail.com',
      username: 'Danielgroup12',
      DOB: new Date('1996-12-16T00:00:00.000Z'),
      isFirstDeposit: false,
      referral: null,
      firstname: 'DANIEL',
      lastname: 'GROUP',
      address1: '60 12th st,',
      address2: '6C',
      city: 'Hoboken',
      state: 'NJ',
      postalCode: '07030',
      identityStatus: true,
      reasonCodes: ['ID-VERIFIED', 'LL-GEO-US-NJ'],
      isAdmin: false,
      phone: null,
    });
    prismaMock.transactionStatus.findMany.mockResolvedValue([]);
  });

  it('should not throw any error', async () => {
    await expect(
      async () =>
        await getUserTotalBalance('0dca00b1-ebcb-40f1-aa14-de3eae2b0c15'),
    ).not.toThrow(TRPCError);
  });

  it('should not allow users to withdraw recently made deposits', async () => {
    const userTotalBalanceBeforeDeposit = await getUserTotalBalance(
      '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
    );

    // Add new deposit
    const depositTransaction = {
      id: '212c3fb9-33ee-45ac-96f3-f9104fb298a9',
      transactionId: 'eH4hfuX6IwTY8OZ8',
      statusCode: 1,
      statusMessage: 'Complete',
      transactionType: TransactionType.CREDIT,
      transactionScore: new Prisma.Decimal('50'),
      transactionMethod: 'Visa ************6531',
      transactionMethodType: PaymentMethodType.CC,
      transactionMethodAccount: 'Credit Card',
      approvalDateTime: new Date('2023-01-04T02:30:15.467Z'),
      statusDateTime: new Date('2023-01-04T02:30:26.180Z'),
      processDateTime: new Date('2023-01-04T02:30:25.400Z'),
      created_at: new Date('2023-01-04T02:30:26.251Z'),
      updated_at: new Date('2023-01-04T02:30:26.251Z'),
      Transaction: {
        id: 'eH4hfuX6IwTY8OZ81',
        actionType: 'PAY',
        sessionId: 'd654d0ba-5395-4fe3-92ea-cfaa9a31744e',
        userId: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
        amountProcess: new Prisma.Decimal('50'),
        amountBonus: new Prisma.Decimal('0'),
        transactionCurrency: 'USD',
        created_at: new Date('2023-01-04T02:30:09.688Z'),
        contestEntryId: null,
        betId: null,
      },
    };
    prismaMock.transactionStatus.findMany.mockResolvedValue([
      depositTransaction,
    ]);
    const userTotalBalanceAfterDeposit = await getUserTotalBalance(
      '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
    );

    // 0 withdrawable amount
    expect(userTotalBalanceBeforeDeposit.withdrawableAmount).toEqual(
      userTotalBalanceAfterDeposit.withdrawableAmount,
    );

    // 50 unplayed amount
    expect(userTotalBalanceAfterDeposit.unPlayedAmount).toEqual(
      Number(depositTransaction.Transaction.amountProcess),
    );
  });

  it('should have an available balance to withdraw after winning a bet', async () => {
    const transactions: TransactionStatusWithTransaction[] = [
      {
        id: '212c3fb9-33ee-45ac-96f3-f912114fb29321',
        transactionId: 'eH4hfuX6IwTY8OZ8',
        statusCode: 1,
        statusMessage: 'Complete',
        transactionType: TransactionType.CREDIT,
        transactionScore: new Prisma.Decimal('50'),
        transactionMethod: 'Visa ************6531',
        transactionMethodType: PaymentMethodType.CC,
        transactionMethodAccount: 'Credit Card',
        approvalDateTime: new Date('2023-01-04T02:30:15.467Z'),
        statusDateTime: new Date('2023-01-04T02:30:26.180Z'),
        processDateTime: new Date('2023-01-04T02:30:25.400Z'),
        created_at: new Date('2023-01-04T02:30:26.251Z'),
        updated_at: new Date('2023-01-04T02:30:26.251Z'),
        Transaction: {
          id: 'eH4hfuX6IwTY8OZ8322',
          actionType: ActionType.PAY,
          sessionId: 'd654d0ba-5395-4fe3-92ea-cfaa9a31744e',
          userId: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
          amountProcess: new Prisma.Decimal('50'),
          amountBonus: new Prisma.Decimal('0'),
          transactionCurrency: 'USD',
          created_at: new Date('2023-01-04T02:30:09.688Z'),
          contestEntryId: null,
          betId: null,
        },
      },
      {
        id: '212c3fb9-33ee-45ac-96f3-f9104fb298a321',
        transactionId: 'eH4hfuX6IwTY8OZ8',
        statusCode: 1,
        statusMessage: 'Complete',
        transactionType: TransactionType.DEBIT,
        transactionScore: new Prisma.Decimal('50'),
        transactionMethod: 'Visa ************6531',
        transactionMethodType: PaymentMethodType.OTHERS,
        transactionMethodAccount: 'Credit Card',
        approvalDateTime: new Date('2023-01-04T02:30:15.467Z'),
        statusDateTime: new Date('2023-01-04T02:30:26.180Z'),
        processDateTime: new Date('2023-01-04T02:30:25.400Z'),
        created_at: new Date('2023-01-04T02:30:26.251Z'),
        updated_at: new Date('2023-01-04T02:30:26.251Z'),
        Transaction: {
          id: 'eH4hfuX6IwTY8OZ833',
          actionType: ActionType.PLACE_BET,
          sessionId: 'd654d0ba-5395-4fe3-92ea-cfaa9a31744e',
          userId: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
          amountProcess: new Prisma.Decimal('10'),
          amountBonus: new Prisma.Decimal('0'),
          transactionCurrency: 'USD',
          created_at: new Date('2023-01-04T02:30:09.688Z'),
          contestEntryId: null,
          betId: null,
        },
      },
    ];
    prismaMock.transactionStatus.findMany.mockResolvedValue(transactions);

    const userTotalBalanceBeforeWin = await getUserTotalBalance(
      '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
    );
    const winTransaction: TransactionStatusWithTransaction = {
      id: '212c3fb9-33ee-45ac-96f3-f9104fb298a2123',
      transactionId: 'eH4hfuX6IwTY8OZ8',
      statusCode: 1,
      statusMessage: 'Complete',
      transactionType: TransactionType.CREDIT,
      transactionScore: new Prisma.Decimal('50'),
      transactionMethod: '',
      transactionMethodType: PaymentMethodType.OTHERS,
      transactionMethodAccount: 'OTHER',
      approvalDateTime: new Date('2023-01-04T02:30:15.467Z'),
      statusDateTime: new Date('2023-01-04T02:30:26.180Z'),
      processDateTime: new Date('2023-01-04T02:30:25.400Z'),
      created_at: new Date('2023-01-04T02:30:26.251Z'),
      updated_at: new Date('2023-01-04T02:30:26.251Z'),
      Transaction: {
        id: 'eH4hfuX6IwTY8OZ81',
        actionType: ActionType.CASH_CONTEST_WIN,
        sessionId: 'd654d0ba-5395-4fe3-92ea-cfaa9a31744e',
        userId: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
        amountProcess: new Prisma.Decimal('50'),
        amountBonus: new Prisma.Decimal('0'),
        transactionCurrency: 'USD',
        created_at: new Date('2023-01-04T02:30:09.688Z'),
        contestEntryId: null,
        betId: null,
      },
    };
    transactions.push(winTransaction);
    prismaMock.transactionStatus.findMany.mockResolvedValue(transactions);

    const userTotalBalanceAfterWin = await getUserTotalBalance(
      '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
    );

    expect(userTotalBalanceBeforeWin.creditAmount).toEqual(
      userTotalBalanceAfterWin.creditAmount,
    );
    expect(userTotalBalanceAfterWin.withdrawableAmount).toEqual(
      Number(winTransaction.Transaction.amountProcess),
    );
  });

  it('should increase credit after refund for no action bet status ', async () => {
    const transactions: TransactionStatusWithTransaction[] = [
      {
        id: '212c3fb9-33ee-45ac-96f3-f9104fb298a9',
        transactionId: 'eH4hfuX6IwTY8OZ8',
        statusCode: 1,
        statusMessage: 'Complete',
        transactionType: TransactionType.CREDIT,
        transactionScore: new Prisma.Decimal('50'),
        transactionMethod: 'Visa ************6531',
        transactionMethodType: PaymentMethodType.CC,
        transactionMethodAccount: 'Credit Card',
        approvalDateTime: new Date('2023-01-04T02:30:15.467Z'),
        statusDateTime: new Date('2023-01-04T02:30:26.180Z'),
        processDateTime: new Date('2023-01-04T02:30:25.400Z'),
        created_at: new Date('2023-01-04T02:30:26.251Z'),
        updated_at: new Date('2023-01-04T02:30:26.251Z'),
        Transaction: {
          id: 'eH4hfuX6IwTY8OZ8322',
          actionType: ActionType.PAY,
          sessionId: 'd654d0ba-5395-4fe3-92ea-cfaa9a31744e',
          userId: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
          amountProcess: new Prisma.Decimal('50'),
          amountBonus: new Prisma.Decimal('0'),
          transactionCurrency: 'USD',
          created_at: new Date('2023-01-04T02:30:09.688Z'),
          contestEntryId: null,
          betId: null,
        },
      },
      {
        id: '212c3fb9-33ee-45ac-96f3-f9104fb298a9',
        transactionId: 'eH4hfuX6IwTY8OZ8',
        statusCode: 1,
        statusMessage: 'Complete',
        transactionType: TransactionType.DEBIT,
        transactionScore: new Prisma.Decimal('50'),
        transactionMethod: 'Visa ************6531',
        transactionMethodType: PaymentMethodType.OTHERS,
        transactionMethodAccount: 'Credit Card',
        approvalDateTime: new Date('2023-01-04T02:30:15.467Z'),
        statusDateTime: new Date('2023-01-04T02:30:26.180Z'),
        processDateTime: new Date('2023-01-04T02:30:25.400Z'),
        created_at: new Date('2023-01-04T02:30:26.251Z'),
        updated_at: new Date('2023-01-04T02:30:26.251Z'),
        Transaction: {
          id: 'eH4hfuX6IwTY8OZ833',
          actionType: ActionType.PLACE_BET,
          sessionId: 'd654d0ba-5395-4fe3-92ea-cfaa9a31744e',
          userId: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
          amountProcess: new Prisma.Decimal('10'),
          amountBonus: new Prisma.Decimal('0'),
          transactionCurrency: 'USD',
          created_at: new Date('2023-01-04T02:30:09.688Z'),
          contestEntryId: null,
          betId: null,
        },
      },
    ];
    prismaMock.transactionStatus.findMany.mockResolvedValue(transactions);
    const userTotalBalanceBefore = await getUserTotalBalance(
      '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
    );

    const cashContestCancelledTrans = {
      id: '212c3fb9-33ee-45ac-96f3-f9104fb298a9',
      transactionId: 'eH4hfuX6IwTY8OZ8',
      statusCode: 1,
      statusMessage: 'Complete',
      transactionType: TransactionType.CREDIT,
      transactionScore: new Prisma.Decimal('50'),
      transactionMethod: '',
      transactionMethodType: PaymentMethodType.OTHERS,
      transactionMethodAccount: 'OTHER',
      approvalDateTime: new Date('2023-01-04T02:30:15.467Z'),
      statusDateTime: new Date('2023-01-04T02:30:26.180Z'),
      processDateTime: new Date('2023-01-04T02:30:25.400Z'),
      created_at: new Date('2023-01-04T02:30:26.251Z'),
      updated_at: new Date('2023-01-04T02:30:26.251Z'),
      Transaction: {
        id: 'eH4hfuX6IwTY8OZ81',
        actionType: ActionType.CASH_CONTEST_CANCELLED,
        sessionId: 'd654d0ba-5395-4fe3-92ea-cfaa9a31744e',
        userId: '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
        amountProcess: new Prisma.Decimal('10'),
        amountBonus: new Prisma.Decimal('0'),
        transactionCurrency: 'USD',
        created_at: new Date('2023-01-04T02:30:09.688Z'),
        contestEntryId: null,
        betId: null,
      },
    };
    transactions.push(cashContestCancelledTrans);
    prismaMock.transactionStatus.findMany.mockResolvedValue(transactions);

    const userTotalBalanceAfter = await getUserTotalBalance(
      '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
    );

    expect(
      userTotalBalanceBefore.creditAmount +
        Number(cashContestCancelledTrans.Transaction.amountProcess),
    ).toEqual(Number(userTotalBalanceAfter.creditAmount));
  });
});
