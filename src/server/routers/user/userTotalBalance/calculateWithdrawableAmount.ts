import { TransactionType } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import { TransactionStatusWithTransaction } from './getUserTotalBalance';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';

/**
 * This function calculates the user un-played amount
 *
 * @param transactionStatus TransactionStatusWithTransaction
 * @param previousTotalWithdrawableAmount number
 * @param totalAmount number
 */
const calculateWithdrawableAmount = (
  transactionStatus: TransactionStatusWithTransaction,
  previousTotalWithdrawableAmount: number,
  totalAmount: number,
): number => {
  const transaction = transactionStatus.Transaction;
  const transactionAmount = Number(transaction.amountProcess);

  let newTotalWithdrawableAmount = previousTotalWithdrawableAmount;
  // Increment withdrawable amount for Bet/Token contest won transaction
  if (
    transactionStatus.transactionType === TransactionType.CREDIT &&
    transactionStatus.statusCode === PaymentStatusCode.COMPLETE &&
    [
      ActionType.TOKEN_CONTEST_WIN,
      ActionType.CASH_CONTEST_WIN,
      ActionType.ADD_WITHDRAWABLE,
    ].includes(transaction.actionType as ActionType)
  ) {
    newTotalWithdrawableAmount =
      previousTotalWithdrawableAmount + transactionAmount;
  }

  /**
   * Decrement withdrawable amount if payout transaction
   * or the transactions that the user accepts the offer to keep the cash balance in the platform
   */
  if (
    transactionStatus.transactionType === TransactionType.DEBIT &&
    [
      ActionType.PAYOUT,
      ActionType.REMOVE_WITHDRAWABLE,
      ActionType.WITHDRAW_BONUS_CREDIT,
    ].includes(transaction.actionType as ActionType) &&
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

  if (newTotalWithdrawableAmount > totalAmount && totalAmount >= 0) {
    newTotalWithdrawableAmount = totalAmount;
  }

  return newTotalWithdrawableAmount;
};

export default calculateWithdrawableAmount;
