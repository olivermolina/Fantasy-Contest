import {
  TransactionStatusWithTransaction,
  PaymentStatusCode,
} from './getUserTotalBalance';
import { TransactionType } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';

/**
 * This function calculates the user total credits
 *
 * @param transactionStatus TransactionStatusWithTransaction
 * @param previousTotalCreditAmount number
 */
const calculateCredits = (
  transactionStatus: TransactionStatusWithTransaction,
  previousTotalCreditAmount: number,
  totalAmount: number,
): number => {
  const transaction = transactionStatus.Transaction;
  const transactionAmount = Number(transaction.amountProcess);
  const transactionBonusAmount = Number(transaction.amountBonus);
  let newTotalCreditAmount = 0;

  // Deposit / Cancelled / Stake won transaction
  if (
    transactionStatus.transactionType === TransactionType.CREDIT &&
    transactionStatus.statusCode === PaymentStatusCode.COMPLETE
  ) {
    switch (transaction.actionType) {
      case ActionType.PAY:
        newTotalCreditAmount =
          previousTotalCreditAmount + transactionBonusAmount;
        break;
      case ActionType.CASH_CONTEST_CANCELLED:
        //Increment credit amount with refunded amount
        newTotalCreditAmount = previousTotalCreditAmount + transactionAmount;
        break;
      case ActionType.ADD_FREE_CREDIT:
        //Increment credit amount with free credits and total amount
        newTotalCreditAmount =
          previousTotalCreditAmount + transactionBonusAmount;
        break;
    }
  }

  // Payout / Join contest / More or Less transaction
  if (transactionStatus.transactionType === TransactionType.DEBIT) {
    switch (transaction.actionType) {
      case ActionType.PLACE_BET:
      case ActionType.JOIN_CONTEST:
        // Deduct credit amount with the stake amount if it's greater than
        if (
          previousTotalCreditAmount > 0 &&
          previousTotalCreditAmount > transactionAmount
        ) {
          newTotalCreditAmount = previousTotalCreditAmount - transactionAmount;
        } else {
          // No more credit amount
          newTotalCreditAmount = 0;
        }
        break;
    }
  }

  return newTotalCreditAmount > totalAmount
    ? totalAmount
    : newTotalCreditAmount;
};

export default calculateCredits;
