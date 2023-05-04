import React from 'react';
import type { TransactionHistoryInterface } from '~/server/routers/user/transactionHistory';
import TransactionHistoryItem from './TransactionHistoryItem';

interface TransactionHistoryProps {
  isLoading: boolean;
  flatData: TransactionHistoryInterface[];
}

function TransactionHistory(props: TransactionHistoryProps) {
  return (
    <div
      className={
        'flex flex-col gap-2 divide-y divide-slate-500 bg-primary border-y border-slate-500'
      }
    >
      {props.flatData.map((row) => (
        <TransactionHistoryItem key={row.id} row={row} />
      ))}
    </div>
  );
}

export default TransactionHistory;
