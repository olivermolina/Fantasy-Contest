import React from 'react';
import { AccountDepositResponseInterface } from '~/server/routers/user/accountDeposit';

interface DepositConfirmationProps {
  depositAmount: number;
  transaction?: AccountDepositResponseInterface;
}

const DepositConfirmation = (props: DepositConfirmationProps) => {
  const { depositAmount } = props;
  return (
    <div className="flex flex-col shadow-md rounded-md divide-y gap-2 bg-white">
      <div className="flex flex-col p-6 gap-2">
        <p className="font-bold text-lg">Account Deposit</p>
        <div className="flex gap-1">
          <span className={'font-bold text-sm'}>$</span>
          <div>
            <p className="font-bold text-3xl">{depositAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-6 py-2 gap-2">
        <div className={'flex flex-col gap-2'}>
          <div className={'flex justify-between text-sm'}>
            <span>Transaction ID:</span>
            <span className={'font-bold'}>
              {props.transaction?.transactionId}
            </span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span>Payment Method:</span>
            <span className={'font-bold'}>
              {props.transaction?.paymentMethod}
            </span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span>Status:</span>
            <span className={'font-bold'}>{props.transaction?.status}</span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span>Date/Time:</span>
            <span className={'font-bold'}>{props.transaction?.dateTime}</span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span>Deposit AMT:</span>
            <span className={'font-bold'}>
              ${props.transaction?.depositAmount.toFixed(2)}
            </span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span>Deposit Bonus:</span>
            <span className={'font-bold'}>
              ${props.transaction?.depositBonus.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-6 gap-2">
        <p className="text-sm">
          Next: It may take to 60 seconds for this deposit amount to show as
          credited in your account.
        </p>
      </div>
    </div>
  );
};

export default DepositConfirmation;
