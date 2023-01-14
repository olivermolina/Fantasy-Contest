import React from 'react';
import ContestDetailLayout from '~/components/ContestDetail/ContestDetailLayout';
import converter from 'number-to-words';

interface PrizesProp {
  rank: number;
  amount: number;
}

export interface PrizesProps {
  prizes: PrizesProp[];
}

const Prizes = (props: PrizesProps) => {
  return (
    <ContestDetailLayout>
      <div className={'flex flex-col gap-4 '}>
        <p className={'font-bold text-xl'}>Budget and prize pool</p>
        {props.prizes.map((prize) => (
          <div key={prize.rank} className={'flex gap-2 items-center'}>
            <div className="w-[75px] h-[75px] bg-red rounded-full flex  justify-center items-center bg-blue-200 text-blue-900 font-bold text-lg">
              {converter.toOrdinal(prize.rank)}
            </div>
            <div className="flex flex-col gap-1">
              <p className={'text-md font-bold'}>${prize.amount}</p>
              {prize.rank === 1 ? (
                <p className={'proper text-sm text-gray-500 capitalize'}>
                  Winner, {converter.toWordsOrdinal(prize.rank)} place
                </p>
              ) : (
                <p className={'proper text-sm text-gray-500 capitalize'}>
                  {converter.toWordsOrdinal(prize.rank)} place
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ContestDetailLayout>
  );
};

export default Prizes;
