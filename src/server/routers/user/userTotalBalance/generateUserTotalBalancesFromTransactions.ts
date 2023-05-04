import { Transaction, TransactionStatus } from '@prisma/client';
import calculateCredits from './calculateCredits';
import calculateUnPlayedAmount from './calculateUnPlayedAmount';
import calculateWithdrawableAmount from './calculateWithdrawableAmount';
import calculateTotalAmount from '~/server/routers/user/userTotalBalance/calculateTotalAmount';
import { UserTotalBalanceInterface } from './getUserTotalBalance';

export function generateUserTotalBalancesFromTransactions(
  transactionStatuses: (TransactionStatus & { Transaction: Transaction })[],
) {
  let creditAmount = 0;
  let unPlayedAmount = 0;
  let withdrawableAmount = 0;
  let totalAmount = 0;

  for (const transactionStatus of transactionStatuses) {
    totalAmount = calculateTotalAmount(transactionStatus, totalAmount);
    creditAmount = calculateCredits(
      transactionStatus,
      creditAmount,
      totalAmount,
    );
    unPlayedAmount = calculateUnPlayedAmount(
      transactionStatus,
      unPlayedAmount,
      creditAmount,
    );
    withdrawableAmount = calculateWithdrawableAmount(
      transactionStatus,
      withdrawableAmount,
      totalAmount,
    );
  }

  // Finalize balances
  const totalCashAmount =
    totalAmount > creditAmount ? totalAmount - creditAmount : 0;

  return {
    totalAmount,
    totalCashAmount,
    creditAmount,
    unPlayedAmount,
    withdrawableAmount,
  } as UserTotalBalanceInterface;
}
