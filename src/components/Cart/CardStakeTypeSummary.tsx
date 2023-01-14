import React from 'react';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  BetStakeType,
  ContestCategory,
  ContestWagerType,
} from '@prisma/client';
import { InsuredPayout } from '~/utils/calculateInsuredPayout';
import { styled } from '@mui/material/styles';
import { showDollarPrefix } from '~/utils/showDollarPrefix';

interface Props {
  stakeType: BetStakeType;
  insuredPayout: InsuredPayout;
  payout: string;
  contestCategory: ContestCategory;
  wagerType: ContestWagerType;

  onUpdateBetStakeType(stakeType: BetStakeType): void;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  '& .MuiToggleButtonGroup-grouped': {
    color: 'black',
    '&.Mui-disabled': {
      border: 0,
    },
    '&.Mui-selected': {
      backgroundColor: '#bbdefb',
      color: '#0d47a1',
    },
    fontWeight: 'bold',
    borderRadius: 28,
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
    className={'text-sm md:text-md'}
  >
    <span className={'font-bold w-5'}>
      {props.correct}/{props.numberOfPicks}
    </span>
    <span>Correct</span>
    <div
      className={
        'flex bg-blue-200 font-bold p-2 h-12 w-12 rounded-full items-center justify-center'
      }
    >
      {props.multiplier}x
    </div>
    <span>Payout</span>
    <span className={'font-bold w-10'}>
      {showDollarPrefix(Number(props.payout), props.isShowDollarPrefix)}
    </span>
  </Stack>
);

const CardStakeTypeSummary = (props: Props) => {
  const onChangeBetStakeType = (
    event: React.MouseEvent<HTMLElement>,
    nextStakeType: BetStakeType,
  ) => {
    props.onUpdateBetStakeType(nextStakeType);
  };

  return (
    <Stack
      sx={(theme) => ({
        p: 2,
        backgroundColor: 'white',
        borderRadius: 10,
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
        exclusive={true}
        fullWidth
      >
        <ToggleButton value={BetStakeType.INSURED}>Insured</ToggleButton>
        <ToggleButton value={BetStakeType.ALL_IN}>All In</ToggleButton>
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
