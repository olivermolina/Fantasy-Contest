import React from 'react';
import { showDollarPrefix } from '~/utils/showDollarPrefix';

export interface PendingSummaryItemProps {
  label: string;
  value: number;
  priority: number;
  isShowDollarPrefix: boolean;
}

interface PendingSummaryProps {
  items: PendingSummaryItemProps[];
}

const PendingSummary: React.FC<PendingSummaryProps> = (props) => {
  return (
    <div
      className={
        'grid grid-rows-1 grid-cols-5 md:grid-rows-1 md:grid-cols-5 gap-2 md:gap-4 p-2 md:p-4 overflow-x-auto'
      }
    >
      {props.items
        ?.sort((a, b) => a.priority - b.priority)
        .map(({ label, value, isShowDollarPrefix }) => (
          <div
            key={`${value}-${label}`}
            className={
              'flex flex-col rounded p-1 md:p-4 bg-gray-100 justify-between md:justify-around gap-1 md:gap-2'
            }
          >
            <p className={'text-gray-400 text-xs md:text-md'}>{label}</p>
            <p className={'font-bold text-sm md:text-lg'}>
              {isShowDollarPrefix ? showDollarPrefix(value, true) : value}
            </p>
          </div>
        ))}
    </div>
  );
};

export default PendingSummary;
