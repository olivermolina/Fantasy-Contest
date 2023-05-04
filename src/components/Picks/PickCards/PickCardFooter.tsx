import React from 'react';
import { PickStatus } from '~/constants/PickStatus';
import { CheckCircle, MinusCircle, XCircle } from '~/components/Picks/Icons';
import { BetStakeType } from '@prisma/client';
import { Divider, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import { InsuredPayoutInterface } from '~/components/Picks/PickCards/StraightCard';
import { showDollarPrefix } from '~/utils/showDollarPrefix';

interface Props {
  /**
   * Amount stake
   * @example 10
   */
  risk?: number;
  /**
   * Pick status
   * @example PENDING
   */
  status?: PickStatus;
  /**
   * Potential win amount for losing picks
   * @example 100
   */
  potentialWin?: number | InsuredPayoutInterface;
  /**
   * Entry stake type
   * @example ALL_IN or INSURED
   */
  stakeType?: BetStakeType;
  /**
   * Pick payout amount
   * @example 100
   */
  payout?: number;
  /**
   * Bonus credits used in staking
   * @example 10
   */
  bonusCreditStake?: number;
  /**
   * Boolean to show bonus credits used column
   * @example true
   */
  isAdminView?: boolean;
}

/**
 * Pick card footer component
 */
const PickCardFooter = (props: Props) => {
  const pickStatus = props.status;

  return (
    <div className="p-1 md:p-2 flex flex-row justify-between gap-1 text-white">
      {/*Entry*/}
      <div className={'flex flex-col items-center'}>
        <p className="text-lightText text-sm">Entry</p>
        <div className="flex font-bold h-full items-center">
          {showDollarPrefix(props.risk || 0, true)}
        </div>
      </div>

      {/*Bonus Credits Used*/}
      {props.isAdminView && (
        <div className={'flex flex-col items-center'}>
          <p className="text-lightText text-sm">Bonus Credit</p>
          <div className="flex font-bold h-full items-center">
            {showDollarPrefix(props.bonusCreditStake || 0, true)}
          </div>
        </div>
      )}

      {/*Potential Win*/}
      <div className={'flex flex-col items-center'}>
        <p className="text-lightText text-sm">
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
            spacing={{ xs: 0.1, md: 1 }}
            className={'text-xs lg:text-sm'}
          >
            <div
              className={
                'flex flex-col justify-center items-center p-1 text-lightText'
              }
            >
              <span>Correct</span>
              <span className={'text-bold font-bold text-white'}>
                {(props.potentialWin as InsuredPayoutInterface).numberOfPicks -
                  1}
                /{(props.potentialWin as InsuredPayoutInterface).numberOfPicks}
              </span>
            </div>
            <div
              className={
                'flex flex-col justify-center items-center p-1 text-lightText'
              }
            >
              <span>Payout</span>
              <span className={'text-bold font-bold text-white'}>
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
                'flex flex-col justify-center items-center p-1 text-lightText'
              }
            >
              <span>Correct</span>
              <span className={'text-bold font-bold text-white'}>
                {(props.potentialWin as InsuredPayoutInterface).numberOfPicks}/
                {(props.potentialWin as InsuredPayoutInterface).numberOfPicks}
              </span>
            </div>
            <div
              className={
                'flex flex-col justify-center items-center p-1 text-lightText'
              }
            >
              <span>Payout</span>
              <span className={'text-bold font-bold text-white'}>
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

      {/*Status*/}
      <div className={'flex flex-col items-center'}>
        <p className="text-lightText text-sm">Status</p>
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

          {pickStatus === PickStatus.CANCELLED ||
          pickStatus === PickStatus.REFUNDED ||
          pickStatus === PickStatus.PUSH ? (
            <MinusCircle className="w-6 h-6 stroke-white fill-yellow-500" />
          ) : null}

          <p className="font-bold capitalize text-sm">
            {pickStatus === PickStatus.PENDING ? pickStatus : null}
            {pickStatus === PickStatus.WIN ? 'WON' : null}
            {pickStatus === PickStatus.LOSS ? 'LOST' : null}
            {pickStatus === PickStatus.CANCELLED ||
            pickStatus === PickStatus.REFUNDED ||
            pickStatus === PickStatus.PUSH
              ? 'NO ACTION'
              : null}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PickCardFooter;
