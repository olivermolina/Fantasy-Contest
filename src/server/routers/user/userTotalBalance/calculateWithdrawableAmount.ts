import { TransactionType } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import {
  PaymentStatusCode,
  TransactionStatusWithTransaction,
} from './getUserTotalBalance';

/**
 * This function calculates the user un-played amount
 *
 * @param transactionStatus TransactionStatusWithTransaction
 * @param previousTotalWithdrawableAmount number
 */
const calculateWithdrawableAmount = (
  transactionStatus: TransactionStatusWithTransaction,
  previousTotalWithdrawableAmount: number,
): number => {
  const transaction = transactionStatus.Transaction;
  const transactionAmount = Number(transaction.amountProcess);

  let newTotalWithdrawableAmount = 0;
  // Increment withdrawable amount for Bet/Token contest won transaction
  if (
    transactionStatus.transactionType === TransactionType.CREDIT &&
    transactionStatus.statusCode === PaymentStatusCode.COMPLETE &&
    [ActionType.TOKEN_CONTEST_WIN, ActionType.CASH_CONTEST_WIN].includes(
      transaction.actionType as ActionType,
    )
  ) {
    newTotalWithdrawableAmount =
      previousTotalWithdrawableAmount + transactionAmount;
  }

  // Decrement withdrawable amount if payout transaction
  if (
    transactionStatus.transactionType === TransactionType.DEBIT &&
    transaction.actionType === ActionType.PAYOUT &&
    [PaymentStatusCode.COMPLETE, PaymentStatusCode.PENDING].includes(
      transactionStatus.statusCode as PaymentStatusCode,
    ) &&
    previousTotalWithdrawableAmount > 0
  ) {
    newTotalWithdrawableAmount =
      previousTotalWithdrawableAmount > transactionAmount
        ? previousTotalWithdrawableAmount - transactionAmount
        : 0;
  }

  return newTotalWithdrawableAmount;
};

export default calculateWithdrawableAmount;
