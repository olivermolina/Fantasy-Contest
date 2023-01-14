import React from 'react';
import { AccountDepositResponseInterface } from '~/server/routers/user/accountDeposit';

interface DepositConfirmationProps {
  payoutAmount: number;
  transaction?: AccountDepositResponseInterface;
}

const PayoutConfirmation = (props: DepositConfirmationProps) => {
  const { payoutAmount } = props;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col p-2 gap-2">
        <div className="flex gap-1">
          <span className={'font-bold text-sm'}>$</span>
          <div>
            <p className="font-bold text-3xl">{payoutAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-2 gap-2">
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
            <span>Payout AMT:</span>
            <span className={'font-bold'}>${payoutAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutConfirmation;
