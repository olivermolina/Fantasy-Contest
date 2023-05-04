import React from 'react';

export function CashAmount(props: {
  onClickAddUserCash: React.MouseEventHandler<HTMLButtonElement> | undefined;
  userCashAmount: number;
}) {
  return (
    <button
      onClick={props.onClickAddUserCash}
      className="flex justify-center items-center"
    >
      <div className="bg-white text-sm flex rounded-lg border-amber-50 border ">
        <div className="flex-grow bg-primary py-1 px-3 text-white rounded-lg rounded-r-none">
          ${props.userCashAmount.toFixed(2)}
        </div>
        <div className="flex-grow py-1 px-3 text-primary mr-1 font-bold bg-white rounded-l-none">
          Add
        </div>
      </div>
    </button>
  );
}
