import React, { useEffect, useMemo } from 'react';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  BetStakeType,
  ContestCategory,
  ContestWagerType,
} from '@prisma/client';
import { InsuredPayout } from '~/utils/calculatePayout';
import { styled } from '@mui/material/styles';
import { showDollarPrefix } from '~/utils/showDollarPrefix';

interface Props {
  stakeType: BetStakeType;
  insuredPayout: InsuredPayout;
  payout: string;
  contestCategory: ContestCategory;
  wagerType: ContestWagerType;
  /**
   *  Boolean to show Free Entry
   * @example true
   */
  isFreeEntry: boolean;
  /**
   * The app setting string value of Free Entry stake type options
   * @example 'ALL_IN, INSURED'
   */
  stakeTypeFreeEntry: string;

  onUpdateBetStakeType(stakeType: BetStakeType): void;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  '& .MuiToggleButtonGroup-grouped': {
    borderColor: 'white',
    color: 'white',
    '&.Mui-disabled': {
      border: 0,
    },
    '&.Mui-selected': {
      backgroundColor: 'white',
      color: '#315a8c',
    },
    backgroundColor: '#315a8c',
    fontWeight: 'bold',
    borderRadius: 5,
    textTransform: 'none',
  },
}));

interface PayoutItemProps {
  correct: number;
  numberOfPicks: number;
  multiplier: number;
  payout: string | number;
  isShowDollarPrefix: boolean;
}

const PayoutItem = (props: PayoutItemProps) => (
  <Stack
    direction="row"
    justifyContent="space-evenly"
    alignItems="center"
    spacing={1}
    className={'text-sm md:text-md text-light'}
  >
    <span className={'font-bold w-5 text-white text-md'}>
      {props.correct}/{props.numberOfPicks}
    </span>
    <span>Correct</span>
    <div
      className={
        'flex bg-[#315A8CFF] text-white text-md font-bold p-2 h-12 w-12 rounded-full  items-center justify-center'
      }
    >
      {props.multiplier}x
    </div>
    <span>Payout</span>
    <span className={'font-bold w-10 text-white text-md'}>
      {showDollarPrefix(Number(props.payout), props.isShowDollarPrefix)}
    </span>
  </Stack>
);

const CardStakeTypeSummary = (props: Props) => {
  const onChangeBetStakeType = (
    event: React.MouseEvent<HTMLElement>,
    nextStakeType: BetStakeType,
  ) => {
    if (nextStakeType) {
      props.onUpdateBetStakeType(nextStakeType);
    }
  };

  const { stakeTypeFreeEntry, isFreeEntry } = props;
  const stakeTypeOptions = useMemo(() => {
    if (isFreeEntry) {
      return stakeTypeFreeEntry.split(',').filter((n) => n);
    }

    return [BetStakeType.ALL_IN.toString(), BetStakeType.INSURED.toString()];
  }, [stakeTypeFreeEntry, isFreeEntry]);

  useEffect(() => {
    if (stakeTypeOptions.length === 1) {
      props.onUpdateBetStakeType(stakeTypeOptions[0] as BetStakeType);
    }
  }, [stakeTypeOptions]);

  return (
    <Stack
      sx={(theme) => ({
        p: 2,
        backgroundColor: '#1A477FFF',
        border: 1,
        borderColor: 'white',
        borderRadius: 2,
        width: '100%',
        [theme.breakpoints.up('lg')]: {
          p: 4,
        },
      })}
      spacing={2}
    >
      <StyledToggleButtonGroup
        value={props.stakeType}
        onChange={onChangeBetStakeType}
        exclusive
        fullWidth
      >
        {stakeTypeOptions.includes(BetStakeType.INSURED.toString()) && (
          <ToggleButton value={BetStakeType.INSURED}>Insured</ToggleButton>
        )}
        {stakeTypeOptions.includes(BetStakeType.ALL_IN.toString()) && (
          <ToggleButton value={BetStakeType.ALL_IN}>All In</ToggleButton>
        )}
      </StyledToggleButtonGroup>

      {props.stakeType === BetStakeType.INSURED ? (
        <>
          <PayoutItem
            correct={props.contestCategory.numberOfPicks}
            numberOfPicks={props.contestCategory.numberOfPicks}
            multiplier={props.contestCategory.primaryInsuredPayoutMultiplier}
            payout={props.insuredPayout.primaryInsuredPayout}
            isShowDollarPrefix={props.wagerType === ContestWagerType.CASH}
          />
          <PayoutItem
            correct={props.contestCategory.numberOfPicks - 1}
            numberOfPicks={props.contestCategory.numberOfPicks}
            multiplier={props.contestCategory.secondaryInsuredPayoutMultiplier}
            payout={props.insuredPayout.secondaryInsuredPayout}
            isShowDollarPrefix={props.wagerType === ContestWagerType.CASH}
          />
        </>
      ) : null}

      {props.stakeType === BetStakeType.ALL_IN ? (
        <>
          <PayoutItem
            correct={props.contestCategory.numberOfPicks}
            numberOfPicks={props.contestCategory.numberOfPicks}
            multiplier={props.contestCategory.allInPayoutMultiplier}
            payout={props.payout}
            isShowDollarPrefix={props.wagerType === ContestWagerType.CASH}
          />
        </>
      ) : null}
    </Stack>
  );
};

export default CardStakeTypeSummary;
