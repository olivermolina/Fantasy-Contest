import React, { useMemo } from 'react';
import classnames from 'classnames';
import { SmallText } from './SmallText';
import { ContestWagerType } from '@prisma/client';
import { NumericFormat } from 'react-number-format';
import { styled } from '@mui/material/styles';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { grey } from '@mui/material/colors';
import { range } from 'lodash';
import { showDollarPrefix } from '~/utils/showDollarPrefix';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderColor: grey[500],
    fontWeight: 'bold',
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    '&.Mui-disabled': {
      border: 0,
    },
    '&.Mui-selected': {
      backgroundColor: grey[800],
      color: 'white',
    },
    '&:not(:first-of-type)': {
      borderColor: grey[500],
      borderRadius: '50%',
    },
    '&:first-of-type': {
      borderRadius: '50%',
    },
  },
}));

export function CartItemSummaryBox(props: {
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
}) {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: number,
  ) => {
    props.onChange(newValue);
  };
  const MAX_LIMIT = props.wagerType === ContestWagerType.CASH ? 50 : 1000;

  const minMaxLimit = useMemo(
    () => ({
      min: showDollarPrefix(1, props.wagerType === ContestWagerType.CASH),
      max: showDollarPrefix(
        MAX_LIMIT,
        props.wagerType === ContestWagerType.CASH,
      ),
    }),
    [props.wagerType, MAX_LIMIT],
  );

  return (
    <div
      className={classnames(
        'flex flex-grow flex-col justify-center items-center gap-2',
      )}
    >
      <span className={'text-lg font-bold'}>Entry Fee</span>

      <SmallText>
        (min: {minMaxLimit.min}, max: {minMaxLimit.max})
      </SmallText>

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
                {v}
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
          min={1}
          isAllowed={(values) => {
            const { value } = values;
            return Number(value) <= MAX_LIMIT;
          }}
          value={Number(props.value || 0)}
          className="font-bold w-16 rounded-lg p-2"
          onValueChange={({ value }) => {
            props.onChange(Number(value) || 0);
          }}
          prefix={props.wagerType === ContestWagerType.CASH ? '$' : undefined}
        />
      </div>
    </div>
  );
}
