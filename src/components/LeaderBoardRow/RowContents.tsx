import React from 'react';
import classNames from 'classnames';
import { AvatarCircle } from '../AvatarCircle';

interface IRowContentsProps {
  name: string;
  points: number;
  rank: number;
  isTopRanked: boolean;
  avatar: {
    imgSrc: string;
    height: number;
    width: number;
  };
}

export const RowContents: React.FC<IRowContentsProps> = (props) => {
  return (
    <>
      <div
        className={classNames(
          `grid grid-cols-[60px_60px_1fr] lg:grid-cols-[200px_200px_1fr] p-1 pl-4 mr-1 gap-1 items-center w-full`,
        )}
      >
        <div
          className={classNames(
            'rank flex items-center justify-center rounded-full w-6 h-6 text-xs font-semibold',
            {
              'bg-white': props.isTopRanked,
              'bg-gray-100': !props.isTopRanked,
            },
          )}
        >
          {props.rank}
        </div>
        <div className="text-xs font-semibold">{props.points}</div>
        <div className="flex items-center justify-center gap-3">
          <AvatarCircle {...props.avatar} />
          <span className="text-xs font-semibold capitalize">{props.name}</span>
        </div>
      </div>
    </>
  );
};
