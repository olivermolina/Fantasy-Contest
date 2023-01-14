import { TransactionType } from '@prisma/client';
import {
  TransactionStatusWithTransaction,
  PaymentStatusCode,
} from './getUserTotalBalance';

/**
 * This function calculates the user total transaction amount
 *
 * @param transactionStatus TransactionStatusWithTransaction
 * @param previousTotalTotalAmount number
 */
const calculateTotalAmount = (
  transactionStatus: TransactionStatusWithTransaction,
  previousTotalTotalAmount: number,
): number => {
  let newTotalAmount = 0;
  const transaction = transactionStatus.Transaction;
  const transactionAmount = Number(transaction.amountProcess);
  const transactionBonusAmount = Number(transaction.amountBonus);

  // Process only completed status for credit transactions
  if (
    transactionStatus.transactionType === TransactionType.CREDIT &&
    transactionStatus.statusCode === PaymentStatusCode.COMPLETE
  ) {
    //Increment total amount with processed amount and bonus/credit amount
    newTotalAmount =
      previousTotalTotalAmount + transactionAmount + transactionBonusAmount;
  }

  //Deduct all debit transactions
  if (
    transactionStatus.transactionType === TransactionType.DEBIT &&
    [PaymentStatusCode.COMPLETE, PaymentStatusCode.PENDING].includes(
      transactionStatus.statusCode as PaymentStatusCode,
    )
  ) {
    newTotalAmount = previousTotalTotalAmount - transactionAmount;
  }

  return newTotalAmount;
};

export default calculateTotalAmount;
