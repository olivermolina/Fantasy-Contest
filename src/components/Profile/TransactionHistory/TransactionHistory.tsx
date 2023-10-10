import React from 'react';
import type { TransactionHistoryInterface } from '~/server/routers/user/transactionHistory';
import TransactionHistoryItem from './TransactionHistoryItem';
import { LoadingSpinner } from '~/components/Cart/LoadingSpinner';

interface TransactionHistoryProps {
  isLoading: boolean;
  transactions: TransactionHistoryInterface[];
}

function TransactionHistory(props: TransactionHistoryProps) {
  return (
    <div
      className={
        'flex flex-col gap-2 divide-y divide-slate-500 border-y border-slate-500'
      }
    >
      {props.isLoading && (
        <div className="flex justify-center items-center p-4">
          <LoadingSpinner />
        </div>
      )}

      {!props.isLoading && props.transactions.length === 0 && (
        <div className="flex justify-center items-center p-4">
          No Transactions
        </div>
      )}

      {props.transactions.map((row) => (
        <TransactionHistoryItem key={row.id} row={row} />
      ))}
    </div>
  );
}

export default TransactionHistory;
