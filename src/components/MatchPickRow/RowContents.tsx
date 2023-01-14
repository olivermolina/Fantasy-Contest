import React from 'react';
import { Button } from './Button';
import { LockIcon } from './LockIcon';

interface IRowContentsProps {
  teamName: string;
  onClickOffer: (type: 'spread' | 'total' | 'moneyline') => void;
  spread: {
    disabled: boolean;
    value: string;
    odds: string;
  };
  total: {
    disabled: boolean;
    value: string;
    odds: string;
  };
  moneyline: {
    disabled: boolean;
    value: string;
  };
}
export const RowContents: React.FC<IRowContentsProps> = (props) => {
  return (
    <>
      <p className="text-sm flex items-center ml-2 center">{props.teamName}</p>
      <div className="flex gap-1">
        <Button
          onClick={() => props.onClickOffer('spread')}
          disabled={props.spread.disabled}
        >
          {props.spread.disabled ? (
            <LockIcon />
          ) : (
            <>
              <p>{props.spread.value}</p>
              <p className="font-bold">{props.spread.odds}</p>
            </>
          )}
        </Button>
        <Button
          onClick={() => props.onClickOffer('total')}
          disabled={props.total.disabled}
        >
          {props.total.disabled ? (
            <LockIcon />
          ) : (
            <>
              <p>{props.total.value}</p>
              <p className="font-bold">{props.total.odds}</p>
            </>
          )}
        </Button>
        <Button
          onClick={() => props.onClickOffer('moneyline')}
          disabled={props.moneyline.disabled}
        >
          {props.moneyline.disabled ? (
            <LockIcon />
          ) : (
            <>
              <p>{props.moneyline.value}</p>
            </>
          )}
        </Button>
      </div>
    </>
  );
};
