import ShortUniqueId from 'short-unique-id';
import { prisma } from '~/server/prisma';
import { ActionType } from '~/constants/ActionType';
import { PaymentMethodType, TransactionType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

interface CreateTransactionInput {
  userId: string;
  amountProcess: number;
  amountBonus: number;
  contestEntryId?: string;
  transactionType: TransactionType;
  actionType: ActionType;
  betId?: string;
}

export const createTransaction = async (input: CreateTransactionInput) => {
  try {
    const {
      userId,
      amountProcess,
      amountBonus,
      contestEntryId,
      transactionType,
      actionType,
      betId,
    } = input;

    const session = await prisma.session.create({
      data: {
        userId: userId,
        serviceType: actionType,
        deviceLocation: '',
        sessionRequestRaw: '',
      },
    });

    const uid = new ShortUniqueId({ length: 16 });
    await prisma.transaction.create({
      data: {
        id: uid(),
        sessionId: session.id,
        actionType: actionType,
        userId: userId,
        amountProcess,
        amountBonus: amountBonus,
        transactionCurrency: 'USD',
        contestEntryId,
        betId,
        TransactionStatuses: {
          create: [
            {
              statusCode: 1, // Mark as complete
              statusMessage: `${transactionType} transaction successfully created`,
              transactionType,
              transactionScore: 0,
              transactionMethod: 'OTHER',
              transactionMethodType: PaymentMethodType.OTHERS,
              transactionMethodAccount: '',
              approvalDateTime: new Date(),
              statusDateTime: new Date(),
            },
          ],
        },
      },
    });
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: CustomErrorMessages.ACCOUNT_TRANSACTION,
    });
  }
};

export default createTransaction;
