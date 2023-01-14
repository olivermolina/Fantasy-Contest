import React from 'react';
import { PickStatus } from '~/constants/PickStatus';
import { CheckCircle, MinusCircle, XCircle } from '~/components/Picks/Icons';
import { BetStakeType } from '@prisma/client';
import { Divider, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import { InsuredPayoutInterface } from '~/components/Picks/PickCards/StraightCard';
import { showDollarPrefix } from '~/utils/showDollarPrefix';

interface Props {
  risk?: number;
  status?: PickStatus;
  potentialWin?: number | InsuredPayoutInterface;
  stakeType?: BetStakeType;
  payout?: number;
}

const PickCardFooter = (props: Props) => {
  const pickStatus = props.status;

  return (
    <div className="p-1 md:p-2 flex flex-row justify-between gap-1">
      {/*Footer Contents*/}
      <div className={'flex flex-col items-center'}>
        <p className="text-gray-400 text-sm">Entry</p>
        <div className="flex font-bold h-full items-center">
          {showDollarPrefix(props.risk || 0, true)}
        </div>
      </div>
      <div className={'flex flex-col items-center'}>
        <p className="text-gray-400 text-sm">
          {pickStatus === PickStatus.WIN ? 'Winnings' : 'Potential Win'}
        </p>
        {props.stakeType === BetStakeType.ALL_IN ||
        pickStatus === PickStatus.WIN ? (
          <div className="font-bold flex font-bold h-full items-center">
            {showDollarPrefix(
              pickStatus === PickStatus.PENDING
                ? (props.potentialWin as number)
                : props.payout || 0,
              true,
            )}
          </div>
        ) : (
          <Stack
            sx={{
              border: 1,
              borderRadius: 1,
              borderColor: grey[200],
              flexGrow: 1,
            }}
            direction={'row'}
            justifyContent={'space-evenly'}
            alignItems="center"
            spacing={{ xs: 0.25, md: 1 }}
            className={'text-sm'}
          >
            <div
              className={
                'flex flex-col justify-center items-center p-1 text-gray-500'
              }
            >
              <span>Correct</span>
              <span className={'text-bold font-bold text-black'}>
                {(props.potentialWin as InsuredPayoutInterface).numberOfPicks -
                  1}
                /{(props.potentialWin as InsuredPayoutInterface).numberOfPicks}
              </span>
            </div>
            <div
              className={
                'flex flex-col justify-center items-center p-1 text-gray-500'
              }
            >
              <span>Payout</span>
              <span className={'text-bold font-bold text-black'}>
                {showDollarPrefix(
                  (props.potentialWin as InsuredPayoutInterface)
                    .secondaryInsuredPayout,
                  true,
                )}
              </span>
            </div>
            <Divider orientation="vertical" flexItem />
            <div
              className={
                'flex flex-col justify-center items-center p-1 text-gray-500'
              }
            >
              <span>Correct</span>
              <span className={'text-bold font-bold text-black'}>
                {(props.potentialWin as InsuredPayoutInterface).numberOfPicks}/
                {(props.potentialWin as InsuredPayoutInterface).numberOfPicks}
              </span>
            </div>
            <div
              className={
                'flex flex-col justify-center items-center p-1 text-gray-500'
              }
            >
              <span>Payout</span>
              <span className={'text-bold font-bold text-black'}>
                {showDollarPrefix(
                  (props.potentialWin as InsuredPayoutInterface)
                    .primaryInsuredPayout,
                  true,
                )}
              </span>
            </div>
          </Stack>
        )}
      </div>
      <div className={'flex flex-col items-center'}>
        <p className="text-gray-400 text-sm">Status</p>
        <div className={'flex flex-col md:flex-row gap-1 items-center h-full'}>
          {pickStatus === PickStatus.PENDING ? (
            <div className="w-4 h-4 border border-gray-300 rounded-full" />
          ) : null}
          {pickStatus === PickStatus.LOSS ? (
            <XCircle className="w-6 h-6 fill-red-500" />
          ) : null}

          {pickStatus === PickStatus.WIN ? (
            <CheckCircle className="w-6 h-6 fill-green-500" />
          ) : null}

          {pickStatus === PickStatus.CANCELLED ? (
            <MinusCircle className="w-6 h-6 stroke-white fill-yellow-500" />
          ) : null}

          <p className="font-bold capitalize text-sm">
            {pickStatus === PickStatus.PENDING ? pickStatus : null}
            {pickStatus === PickStatus.WIN ? 'WON' : null}
            {pickStatus === PickStatus.LOSS ? 'LOST' : null}
            {pickStatus === PickStatus.CANCELLED ? 'NO ACTION' : null}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PickCardFooter;
