import React, { useEffect } from 'react';
import { ICartItemProps } from './ICartItemProps';
import { SmallText } from './SmallText';
import { CartItemSummaryBox } from './CartItemSummaryBox';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardStakeTypeSummary from '~/components/Cart/CardStakeTypeSummary';

const StyledToggleButton = styled(ToggleButton)({
  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: 'white',
    color: 'black',
  },
  color: 'white',
  backgroundColor: '#003370',
  borderColor: 'white',
  textTransform: 'none',
});

export function CartItem(props: ICartItemProps) {
  const onChange = (newValue: number) => {
    props.onUpdateCartItem(props.id, newValue || 0);
  };

  useEffect(() => {
    if (props.freeEntryCount > 0) {
      props.onUpdateCartItem(props.id, props.freeEntryStake || 0);
    }
  }, [props]);

  return (
    <>
      {props.legs.map((leg) => (
        <div
          key={leg.id}
          className="p-4 flex flex-row border-b border-gray-300 justify-between"
        >
          <div className={'flex flex-col gap-2'}>
            <span className="font-bold text-white">{leg.betName}</span>
            <SmallText textColor={'text-[#69a4f3]'}>
              <span className="uppercase">{leg.league}</span> | {leg.matchTime}
            </SmallText>
            <SmallText textColor={'text-[#69a4f3]'}>
              {leg.awayTeamName} vs. {leg.homeTeamName}
            </SmallText>

            <p>
              <span className="text-xs text-[#69a4f3]">
                Proj {leg.statName}:{' '}
              </span>
              <span className="font-bold text-[#69a4f3]">{leg.betType}</span>
            </p>
          </div>
          <div className={'flex flex-col justify-between items-end gap-2'}>
            <button onClick={leg.onClickDeleteCartItem} className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="right-4">
              <ToggleButtonGroup
                orientation="vertical"
                value={leg.betOption}
                exclusive
                sx={{ width: 150 }}
                onChange={leg.onClickMoreLess}
              >
                <StyledToggleButton value="over" aria-label="more">
                  <span className="font-bold  text-sm capitalize">More</span>
                </StyledToggleButton>
                <StyledToggleButton value="under" aria-label="less" fullWidth>
                  <span className="font-bold  text-sm capitalize">Less</span>
                </StyledToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        </div>
      ))}
      <div className="flex flex-grow flex-col bg-primary justify-center items-center p-4 gap-5">
        {props.freeEntryCount > 0 ? (
          <div className="text-center">
            <p className={'text-lg font-bold'}> Free Entry</p>
            <SmallText>Bonus Credit Stake: ${props.freeEntryStake}</SmallText>
          </div>
        ) : (
          <CartItemSummaryBox
            isAbleToEdit
            label="Entry"
            value={props.stake}
            isPrimary
            onChange={onChange}
            wagerType={props.wagerType}
            maxBetAmount={props.maxBetAmount}
            minBetAmount={props.minBetAmount}
          />
        )}

        <CardStakeTypeSummary
          stakeType={props.stakeType}
          onUpdateBetStakeType={props.onUpdateBetStakeType}
          insuredPayout={props.insuredPayout}
          contestCategory={props.contestCategory}
          payout={props.payout}
          wagerType={props.wagerType!}
          stakeTypeFreeEntry={props.stakeTypeFreeEntry || ''}
          isFreeEntry={props.freeEntryCount > 0}
        />
      </div>
    </>
  );
}
