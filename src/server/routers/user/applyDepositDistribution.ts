import { TransactionType } from '@prisma/client';
import { prisma } from '~/server/prisma';
import { ActionType } from '~/constants/ActionType';

/**
 * This function apply entry/join contest distribution to deposit/credit transactions
 * in order to determine how much money is played/un-played
 *
 * @param userId
 * @param entryAmount
 * @param betId
 * @param contestEntryId
 */
const applyDepositDistribution = async (
  userId: string,
  entryAmount: number,
  betId?: string,
  contestEntryId?: string,
) => {
  if (entryAmount <= 0) return;
  if (!betId && !contestEntryId) return;

  const creditTransactionsWithCompleteStatus =
    await prisma.transaction.findMany({
      where: {
        userId,
        TransactionStatuses: {
          every: {
            statusCode: 1, // Means completed transaction
            transactionType: TransactionType.CREDIT,
          },
        },
        actionType: {
          notIn: [ActionType.CASH_CONTEST_WIN, ActionType.TOKEN_CONTEST_WIN],
        },
      },
      orderBy: {
        actionType: 'asc', // sort the free credits transaction first
      },
      include: {
        TransactionStatuses: true,
        DepositDistributions: true,
      },
    });

  let unAppliedEntryAmountBalance = entryAmount;
  const promises = [];
  for (const transaction of creditTransactionsWithCompleteStatus) {
    if (unAppliedEntryAmountBalance <= 0) break;

    if (!transaction) continue;

    const transactionStatus = transaction.TransactionStatuses[0];
    if (!transactionStatus) continue;

    const transactionAppliedAmount = transaction.DepositDistributions?.reduce(
      (n, { amount }) => n + Number(amount),
      0,
    );

    const transactionAmount =
      Number(transaction.amountProcess) + Number(transaction.amountBonus);
    if (transactionAppliedAmount >= transactionAmount) continue;

    const transactionUnAppliedAmount =
      transactionAmount - transactionAppliedAmount;
    let applyAmount = 0;

    if (unAppliedEntryAmountBalance >= transactionUnAppliedAmount) {
      applyAmount = transactionUnAppliedAmount;
      unAppliedEntryAmountBalance -= transactionUnAppliedAmount;
    } else {
      applyAmount = unAppliedEntryAmountBalance;
      unAppliedEntryAmountBalance = 0;
    }

    promises.push(
      prisma.depositDistribution.create({
        data: {
          Transaction: { connect: { id: transaction.id } },
          ...(betId && {
            Bet: { connect: { id: betId } },
          }),
          ...(contestEntryId && {
            ContestEntry: { connect: { id: contestEntryId } },
          }),
          amount: applyAmount,
        },
      }),
    );
  }

  await Promise.all(promises);
};

export default applyDepositDistribution;
