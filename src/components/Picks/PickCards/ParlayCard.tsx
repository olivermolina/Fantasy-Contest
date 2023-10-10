import React from 'react';
import ParlayBetPicks, {
  ParlayBetPickProps,
} from '~/components/Picks/PickCards/ParlayBetPicks';
import { DefaultPickProps } from '~/components/Picks/PickCards/StraightCard';
import PickCardFooter from '~/components/Picks/PickCards/PickCardFooter';
import { PickStatus } from '~/constants/PickStatus';
import { BetStakeType } from '@prisma/client';

export interface ParlayCardProps extends DefaultPickProps {
  picks?: ParlayBetPickProps[];
  status: PickStatus;
  payout?: number;
}

const ParlayCard: React.FC<ParlayCardProps> = (props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border border-slate-500 divide-y divide-slate-500 rounded-md text-white">
      {/*Card Header*/}
      <div className="flex flex-column justify-between p-2">
        <div className={'text-sm'}>
          <p className={'text-lg md:text-xl font-bold'}>
            {props.name} ({props.picks?.length} Picks)
          </p>
          <p>
            <span className={'text-lightText mr-1 '}>Entry ID:</span>{' '}
            <span className="font-semibold text-md">{props.id}</span>
          </p>
          <p>
            <span className={'text-lightText mr-1 '}>Contest Type:</span>{' '}
            <span className="font-semibold text-md">{props.contestType}</span>
          </p>
          <p>
            <span className={'text-lightText mr-1'}>Payout:</span>{' '}
            <span className="font-semibold text-md">
              {props.stakeType === BetStakeType.INSURED ? 'Insured' : 'All In'}
            </span>
          </p>
          <p>
            <span className={'text-lightText mr-1'}>Placed Date/Time:</span>{' '}
            <span className={'font-semibold text-xs'}>{props.pickTime}</span>
          </p>
          {props.status !== PickStatus.PENDING && (
            <p>
              <span className={'text-lightText mr-1'}>Settled Date/Time:</span>{' '}
              <span className={'font-semibold  text-xs'}>
                {props.settledTime}
              </span>
            </p>
          )}
        </div>
        <div className={'p-4'}>
          <button
            className="font-bold text-md text-blue-400"
            onClick={() => setOpen(!open)}
          >
            {open ? 'COLLAPSE' : 'OPEN'}
          </button>
        </div>
      </div>

      {/*Card Body*/}
      <div
        className={`${
          open ? 'h-auto p-2 md:p5 ease-in' : 'h-0 ease-out'
        } duration-300 overflow-hidden w-full`}
      >
        <ParlayBetPicks parlayBetPicks={props.picks} />
      </div>

      {/*Card Footer*/}
      <PickCardFooter {...props} status={props.status} payout={props.payout} />
    </div>
  );
};

export default ParlayCard;
