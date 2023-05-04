import React from 'react';
import { TransactionHistoryInterface } from '~/server/routers/user/transactionHistory';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { EntryDatetimeFormat } from '~/constants/EntryDatetimeFormat';

interface Props {
  row: TransactionHistoryInterface;
}

export default function TransactionHistoryItem(props: Props) {
  const { row } = props;

  return (
    <div
      className={
        'grid grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-4 bg-inherit p-4'
      }
    >
      <p className={'flex flex-col gap-2'}>
        <span className={'text-lightText text-sm lg:text-md'}>
          Transaction Date
        </span>
        <span className={'text-white text-md lg:text-lg'}>
          {dayjs(row.transactionDate).format(EntryDatetimeFormat)}
        </span>
      </p>
      <p className={'flex flex-col gap-2'}>
        <span className={'text-lightText text-sm lg:text-md'}>Amount</span>
        <span className={'text-white text-md lg:text-lg'}>
          {row.amount.toFixed(2)}
        </span>
      </p>
      <p className={'flex flex-col gap-2'}>
        <span className={'text-lightText text-sm lg:text-md'}>Type</span>
        <span className={'text-white text-md lg:text-lg'}>{row.type}</span>
      </p>
      <p className={'flex flex-col gap-2'}>
        <span className={'text-lightText text-sm lg:text-md'}>
          Free Credits
        </span>
        <span className={'text-white text-md lg:text-lg'}>
          {row.amountBonus.toFixed(2)}
        </span>
      </p>
      <p className={'flex flex-col gap-2'}>
        <span className={'text-lightText text-sm lg:text-md'}>Details</span>
        <span className={'text-white text-md lg:text-lg'}>{row.details}</span>
      </p>
      <p className={'flex flex-col gap-2'}>
        <span className={'text-lightText text-sm lg:text-md'}>Status</span>
        <div
          className={
            'flex w-fit text-md rounded-lg lg:text-lg bg-[#1A4265] items-center gap-2 p-2 '
          }
        >
          <span
            className={classNames('rounded-full p-2 w-2 h-2', {
              'bg-green-500': row.status === 'COMPLETE',
              'bg-yellow-600': row.status === 'PENDING',
              'bg-red-600': row.status === 'FAILED',
            })}
          />
          <p
            className={classNames('uppercase text-md text-white', {
              'text-green-500': row.status === 'COMPLETE',
              'text-yellow-600': row.status === 'PENDING',
              'text-red-600': row.status === 'FAILED',
            })}
          >
            {row.status}
          </p>
        </div>
      </p>
    </div>
  );
}
