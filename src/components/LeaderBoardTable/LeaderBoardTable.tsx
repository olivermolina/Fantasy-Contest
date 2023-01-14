import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes, PillButtons, LeaderBoardRow } from '..';
import { LeaderBoardRowPropTypes } from '../LeaderBoardRow/LeaderBoardRow';
import { PillButtonsPropTypes } from '../PillButtons/PillButtons';

const LeaderBoardTablePropTypes = {
  contests: PillButtonsPropTypes.pills.isRequired,
  leaders: PropTypes.arrayOf(
    PropTypes.shape(LeaderBoardRowPropTypes).isRequired,
  ).isRequired,
};

type Props = InferPropTypes<typeof LeaderBoardTablePropTypes>;

export const LeaderBoardTable = (props: Props) => {
  return (
    <div className="grid grid-rows-[60px_1fr] gap-3 h-screen">
      <div className="my-2 lg:my-4">
        <PillButtons pills={props?.contests} />
      </div>
      <div className="flex flex-col overflow-y-auto w-full pb-12">
        {props?.leaders?.map((items, idx) => (
          <>
            <LeaderBoardRow key={items.id} {...items} showHeader={idx === 0} />
          </>
        ))}
      </div>
    </div>
  );
};

LeaderBoardTable.propTypes = LeaderBoardTablePropTypes;
