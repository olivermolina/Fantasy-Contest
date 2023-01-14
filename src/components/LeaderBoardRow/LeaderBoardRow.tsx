import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '..';
import { RowContents } from './RowContents';
import classNames from 'classnames';

const avatarPropTypes = {
  imgSrc: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export const LeaderBoardRowPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  points: PropTypes.number.isRequired,
  rank: PropTypes.number.isRequired,
  isTopRanked: PropTypes.bool.isRequired,
  avatar: PropTypes.shape(avatarPropTypes).isRequired,
  showHeader: PropTypes.bool,
};

type Props = InferPropTypes<typeof LeaderBoardRowPropTypes>;

export const LeaderBoardRow = (props: Props) => {
  return (
    <div className={`${props.isTopRanked ? 'px-3' : 'px-0'}`}>
      {props.showHeader && (
        <div
          className={`grid grid-cols-[60px_60px_1fr] lg:grid-cols-[200px_200px_1fr] p-1 pl-4 w-full text-gray-500 font-bold  gap-1 bg-gray-200`}
        >
          <div className="p-2 text-xs">RANK</div>
          <div className="p-2 text-xs">PTS</div>
          <div className="p-2 text-xs">NAME</div>
        </div>
      )}
      {!props.isTopRanked && (
        <div
          className={classNames(
            `grid grid-cols-[60px_60px_1fr] lg:grid-cols-[200px_200px_1fr] p-1 pl-4 w-full bg-white justify-between border border-b-0  border-gray-200`,
          )}
        >
          <RowContents
            name={props.name}
            avatar={props.avatar}
            points={props.points}
            rank={props.rank}
            isTopRanked={false}
          />
        </div>
      )}
      {props.isTopRanked && (
        <div
          className={classNames(
            `grid grid-cols-[60px_60px_1fr] py-1  w-full bg-white justify-between border  border-gray-200`,
            {
              'border-blue-400 border-1 bg-blue-100 rounded bottom-2 mt-2 relative':
                props.isTopRanked,
            },
          )}
        >
          <RowContents
            name={props.name}
            avatar={props.avatar}
            points={props.points}
            rank={props.rank}
            isTopRanked={true}
          />
        </div>
      )}
    </div>
  );
};

LeaderBoardRow.propTypes = LeaderBoardRowPropTypes;
