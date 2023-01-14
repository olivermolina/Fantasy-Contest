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
 * @param previousTotalUnPlayedAmount number
 * @param creditAmount number
 */
const calculateUnPlayedAmount = (
  transactionStatus: TransactionStatusWithTransaction,
  previousTotalUnPlayedAmount: number,
  creditAmount: number,
): number => {
  const transaction = transactionStatus.Transaction;
  const transactionAmount = Number(transaction.amountProcess);

  let newTotalUnPlayedAmount = 0;
  if (
    transactionStatus.transactionType === TransactionType.CREDIT &&
    transactionStatus.statusCode === PaymentStatusCode.COMPLETE &&
    transaction.actionType === ActionType.PAY
  ) {
    // Increment un-played amount
    newTotalUnPlayedAmount = previousTotalUnPlayedAmount + transactionAmount;
  }

  // Re-calculate unplayed amount for Place bet / Join contest transaction
  if (transactionStatus.transactionType === TransactionType.DEBIT) {
    switch (transaction.actionType) {
      case ActionType.PLACE_BET:
      case ActionType.JOIN_CONTEST:
        if (previousTotalUnPlayedAmount > 0 && creditAmount > 0) {
          const difference =
            transactionAmount > creditAmount
              ? transactionAmount - creditAmount
              : 0;
          // Deduct the difference if unPlayed amount is greater than
          newTotalUnPlayedAmount =
            previousTotalUnPlayedAmount > difference
              ? previousTotalUnPlayedAmount - difference
              : 0;
        }
        break;
    }
  }

  return newTotalUnPlayedAmount;
};

export default calculateUnPlayedAmount;
