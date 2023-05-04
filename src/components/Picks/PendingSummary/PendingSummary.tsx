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
    <div className={'flex overflow-x-auto gap-2 w-full bg-primary p-2'}>
      {props.items
        ?.sort((a, b) => a.priority - b.priority)
        .map(({ label, value, isShowDollarPrefix }) => (
          <div
            key={`${value}-${label}`}
            className={
              'flex flex-col rounded p-2 bg-gray-100 justify-center gap-1 bg-[#0D3D77]'
            }
          >
            <span
              className={
                'text-gray-400 text-xs md:text-sm md:text-md text-[#65A0EE]'
              }
            >
              {label}
            </span>
            <span className={'font-bold text-sm md:text-lg text-white'}>
              {isShowDollarPrefix ? showDollarPrefix(value, true) : value}
            </span>
          </div>
        ))}
    </div>
  );
};

export default PendingSummary;
