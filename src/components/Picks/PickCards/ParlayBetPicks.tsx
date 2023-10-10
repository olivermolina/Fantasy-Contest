import React from 'react';
import { DefaultPickProps } from '~/components/Picks/PickCards/StraightCard';
import {
  CheckCircle,
  MinusCircle,
  PendingCircle,
  XCircle,
} from '~/components/Picks/Icons';
import { PickStatus } from '~/constants/PickStatus';
import { BetLegType } from '@prisma/client';
import { CardTag } from '~/components/FantasyPicker/CardTag';

export interface ParlayBetPickProps extends DefaultPickProps {
  gameInfo?: string;
  matchTime?: string;
  teamAbbrev?: string;
  team?: string;
}

interface ParlayBetPicksProps {
  parlayBetPicks?: ParlayBetPickProps[];
}

const ParlayBetPicks: React.FC<ParlayBetPicksProps> = (props) => {
  return (
    <div className="flex flex-col">
      {props.parlayBetPicks?.map(
        ({
          id,
          name,
          description,
          gameInfo,
          matchTime,
          value,
          status,
          odd,
          category,
          team,
          league,
          eventName,
        }) => (
          <div key={id} className="flex">
            <div className="flex flex-col items-center mr-2">
              <div className="flex items-center justify-center">
                {status === PickStatus.PENDING && (
                  <PendingCircle className="w-6 h-6 stroke-gray-300 fill-white" />
                )}
                {status === PickStatus.LOSS && (
                  <XCircle className="w-6 h-6 fill-red-500" />
                )}
                {status === PickStatus.WIN && (
                  <CheckCircle className="w-6 h-6 fill-green-500" />
                )}
                {(status === PickStatus.PUSH ||
                  status === PickStatus.CANCELLED ||
                  status === PickStatus.REFUNDED) && (
                  <MinusCircle className="w-6 h-6 fill-yellow-400" />
                )}
              </div>
              <div className="w-px h-full bg-slate-500" />
            </div>
            <div className="flex flex-col justify-between w-full h-full">
              <div className="flex flex-column justify-between items-center border-b border-slate-500 pb-1 mb-1">
                <div className={'flex flex-col gap-1 text-sm text-lightText'}>
                  <p className="font-bold text-white">{name}</p>
                  <p>{gameInfo}</p>
                  <p>{matchTime}</p>
                  <div className={'flex flex-wrap gap-0.5 lg:gap-2'}>
                    <CardTag>{description}</CardTag>
                    <CardTag>{team}</CardTag>
                    <CardTag>{league}</CardTag>
                    {eventName && <CardTag>{eventName}</CardTag>}
                  </div>
                </div>
                <div className={'p-1 lg:p-4 text-right'}>
                  <p className={'font-bold text-sm md:text-md'}>
                    {odd === BetLegType.OVER_ODDS ? 'More ' : 'Less '}
                    {value?.toFixed(2)} {category}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default ParlayBetPicks;
