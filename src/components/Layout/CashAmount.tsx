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
      <div className="bg-white text-sm flex rounded-lg">
        <div className="flex-grow py-1 px-3 text-blue-500">
          ${props.userCashAmount.toFixed(2)}
        </div>
        <div className="flex-grow py-1 px-3 rounded-lg rounded-l-none text-blue-500 bg-blue-200">
          Add
        </div>
      </div>
    </button>
  );
}
