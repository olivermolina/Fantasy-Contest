import React, { useRef } from 'react';
import { ContestCard, contestCardPropTypes } from './ContestCard';
import PropTypes from 'prop-types';
import { InferPropTypes } from '..';
import { Skeleton } from '@mui/material';

const contestPickerPropTypes = {
  contests: PropTypes.arrayOf(PropTypes.shape(contestCardPropTypes).isRequired)
    .isRequired,
  isLoading: PropTypes.bool,
};

type Props = InferPropTypes<typeof contestPickerPropTypes>;

export const ContestPicker: React.FC<Props> = ({ contests, isLoading }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const scrollLeft = () => {
    divRef.current?.scrollBy({
      left: -152 * 3,
    });
  };
  const scrollRight = () => {
    divRef.current?.scrollBy({
      left: 152 * 3,
    });
  };
  return (
    <div className="relative mx-8 lg:mx-4">
      <h3 className="font-bold text-lg">☆ AVAILABLE CONTESTS</h3>
      <button
        onClick={scrollLeft}
        className="bg-white text-black rounded-full p-4 absolute bottom-8 z-10 -left-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={scrollRight}
        className="bg-white text-black rounded-full p-4 absolute bottom-8 z-10 -right-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div
        ref={divRef}
        style={{
          scrollBehavior: 'smooth',
        }}
        className="hide-scrollbar grid content-start justify-start grid-flow-col-dense p-2 gap-2 overflow-x-scroll ml-4 mr-4"
      >
        {isLoading ? (
          <>
            <Skeleton variant={'rectangular'} height={100} width={160} />
            <Skeleton variant={'rectangular'} height={100} width={160} />
          </>
        ) : (
          contests.map((contest, i) => <ContestCard key={i} {...contest} />)
        )}
      </div>
    </div>
  );
};
