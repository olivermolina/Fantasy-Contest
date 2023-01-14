import React from 'react';
import { BetLegType, BetStakeType } from '@prisma/client';
import { PickStatus } from '~/constants/PickStatus';
import PickCardFooter from '~/components/Picks/PickCards/PickCardFooter';

export interface InsuredPayoutInterface {
  numberOfPicks: number;
  primaryInsuredPayout: number;
  secondaryInsuredPayout: number;
}

export interface DefaultPickProps {
  id: any;
  name: string;
  gameInfo?: string;
  description?: string;
  contestType?: string;
  pickTime?: string;
  value?: number;
  risk?: number;
  potentialWin?: number | InsuredPayoutInterface;
  status?: PickStatus;
  odd?: BetLegType;
  category?: string;
  stakeType?: BetStakeType;
  league?: string;
}

export interface StraightPickProps extends DefaultPickProps {
  gameInfo?: string;
}

const StraightCard: React.FC<StraightPickProps> = (props) => {
  return (
    <div className="border divide-y rounded-md">
      {/*Card Header*/}
      <div className="flex flex-column justify-between p-1 md:p-5">
        <div className={'text-sm'}>
          <p className={'text-gray-400 text-xs'}>{props.name}</p>
          <p className="font-bold">{props.description}</p>
          <p className="font-semibold">{props.gameInfo}</p>
          <p>
            <span className={'text-gray-400 mr-2'}>Contest Type:</span>{' '}
            <span className="font-semibold">{props.contestType}</span>
          </p>
          <p className={'text-gray-400 text-xs'}> {props.pickTime}</p>
        </div>
        <div className={'p-1 md:p-4 items-end'}>
          <p className={'font-bold text-sm'}>
            {props.odd === BetLegType.OVER_ODDS ? 'More ' : 'Less '}
            {props.value} {props.category}
          </p>
        </div>
      </div>

      {/*Card Footer*/}
      <PickCardFooter {...props} />
    </div>
  );
};

export default StraightCard;
