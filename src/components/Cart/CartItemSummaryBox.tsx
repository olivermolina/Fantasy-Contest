import React, { useMemo } from 'react';
import classnames from 'classnames';
import { SmallText } from './SmallText';
import { ContestWagerType } from '@prisma/client';
import { NumericFormat } from 'react-number-format';
import { styled } from '@mui/material/styles';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { range } from 'lodash';
import { showDollarPrefix } from '~/utils/showDollarPrefix';
import { DefaultAppSettings } from '~/constants/AppSettings';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderColor: 'white',
    fontWeight: 'bold',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    '&.Mui-disabled': {
      border: 0,
    },
    backgroundColor: '#1A477FFF',
    '&.Mui-selected': {
      backgroundColor: 'white',
      color: '#003370',
    },
    '&:not(:first-of-type)': {
      borderColor: 'white',
      height: '1.75em',
      width: '1.75em',
      padding: '1.75em',
      borderRadius: '50%',
    },
    '&:first-of-type': {
      height: '1.75em',
      width: '1.75em',
      padding: '1.75em',
      borderRadius: '50%',
    },
  },
}));

interface CartItemSummaryBoxProps {
  minBetAmount: number;
  maxBetAmount: number;

  onChange(value: number): void;

  isAbleToEdit?: boolean;
  isPrimary?: boolean;
  label:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
  value: string | number | undefined;
  wagerType?: ContestWagerType;
}

export function CartItemSummaryBox(props: CartItemSummaryBoxProps) {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: number,
  ) => {
    props.onChange(newValue);
  };
  const MAX_LIMIT =
    props.wagerType === ContestWagerType.CASH ? props.maxBetAmount : 1000;

  const minMaxLimit = useMemo(
    () => ({
      min: showDollarPrefix(
        props.minBetAmount || DefaultAppSettings.MIN_BET_AMOUNT,
        props.wagerType === ContestWagerType.CASH,
      ),
      max: showDollarPrefix(
        props.maxBetAmount || DefaultAppSettings.MAX_BET_AMOUNT,
        props.wagerType === ContestWagerType.CASH,
      ),
    }),
    [props.wagerType, props.maxBetAmount, props.minBetAmount],
  );

  return (
    <div
      className={classnames(
        'flex flex-grow flex-col justify-center items-center gap-4',
      )}
    >
      <div className={'flex flex-col justify-center items-center'}>
        <span className={'text-lg font-bold text-white'}>Entry Fee</span>
        <SmallText textColor={'text-light'}>
          (min: {minMaxLimit.min}, max: {minMaxLimit.max})
        </SmallText>
      </div>

      <div className={'flex flex-row gap-2'}>
        <StyledToggleButtonGroup
          value={Number(props.value)}
          exclusive={true}
          onChange={handleChange}
          size="large"
        >
          {range(MAX_LIMIT * 0.2, MAX_LIMIT, MAX_LIMIT * 0.3)
            .slice(0, -1)
            .map((v) => (
              <ToggleButton value={v} key={v}>
                {props.wagerType === ContestWagerType.CASH ? '$' : ''}
                {Math.ceil(v)}
              </ToggleButton>
            ))}
          <ToggleButton value={MAX_LIMIT}>
            {props.wagerType === ContestWagerType.CASH ? '$' : ''}
            {MAX_LIMIT}
          </ToggleButton>
        </StyledToggleButtonGroup>

        <NumericFormat
          allowNegative={false}
          disabled={!props.isAbleToEdit}
          min={props.minBetAmount}
          max={props.maxBetAmount}
          isAllowed={(values) => {
            const { value } = values;
            return Number(value) <= props.maxBetAmount;
          }}
          value={Number(props.value || 0)}
          className="font-bold w-16 rounded-lg p-2 bg-primary text-white border-white border outline-1 outline-white"
          onValueChange={({ value }) => {
            props.onChange(Number(value) || 0);
          }}
          prefix={props.wagerType === ContestWagerType.CASH ? '$' : undefined}
        />
      </div>
    </div>
  );
}
