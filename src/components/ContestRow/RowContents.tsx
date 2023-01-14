import React from 'react';
import { Button } from '../Button';
import { Avatar } from '../Avatar';
import { TopLeaders } from './TopLeaders';

interface IRowContentsProps {
  id: string;
  avatar: {
    imgSrc: string;
    height: number;
    width: number;
    variant: string;
  };
  name: string;
  onClickJoinContest: () => void;
  startDate: string;
  endDate: string;
  leaders: any;
  entryFee: number;
  totalPrize: number;
  entries: number;
  isJoined: boolean;
}
export const RowContents: React.FC<IRowContentsProps> = (props) => {
  return (
    <>
      <div
        className={`grid lg:grid-cols-[1fr_.5fr_.5fr_.5fr_1fr] p-1 lg:pl-4 lg:mr-1 gap-2 border-2 border-t-0 rounded lg:border-0 items-center justify-center`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-4">
          <Avatar {...props.avatar} />
          <div className="flex-col lg:w-96">
            <div className="text-black text-2xl lg:text-base font-bold">
              {props.name}
            </div>
            <div className="flex gap-8 lg:gap-6 text-2xl lg:text-base">
              <div>
                <span>Starts : </span>
                <p>{props.startDate}</p>
              </div>
              <div>
                <span>Ends : </span>
                <p>{props.endDate}</p>{' '}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:hidden mt-3">
          <div className="flex">
            <div className="w-28 text-lg">ENTRY FEE</div>
            <div className="w-28 text-lg">TOTAL PRIZES</div>
            <div className="w-28 text-lg pl-3">ENTRIES</div>
          </div>
          <div className="flex">
            <div className="w-28 font-bold pt-2">${props.entryFee}</div>
            <div className="w-28 font-bold p-2">${props.totalPrize}</div>
            <div className="w-28 font-bold p-2 pl-3">{props.entries}</div>
          </div>
        </div>
        <div className="font-bold p-2 hidden lg:block">${props.entryFee}</div>
        <div className="font-bold p-2 hidden lg:block">${props.totalPrize}</div>
        <div className="font-bold p-2 hidden lg:block">{props.entries}</div>
        <div className="flex items-center justify-center lg:gap-8 lg:w-96 border-t-2 lg:border-0 p-4 lg:p-0 ">
          <TopLeaders leaders={props.leaders} />
          <Button
            onClick={props.onClickJoinContest}
            variant={props.isJoined ? 'outline' : 'primary'}
          >
            <div className="text-sm">
              {props.isJoined ? 'Joined' : 'Join Competition'}
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};
