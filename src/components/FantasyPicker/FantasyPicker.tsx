import React from 'react';
import { PillButtons, PillButtonsProps } from '../PillButtons/PillButtons';
import { FantasyCard, FantasyCardProps } from './FantasyCard';
import { ParlayModel } from '~/state/bets';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DebouncedInput from '~/components/ContestDetail/Entries/DebouncedInput';

interface Props extends React.PropsWithChildren {
  filters: PillButtonsProps['pills'];
  cards: FantasyCardProps[];
  legs?: ParlayModel['legs'];
  categoryBgColor: string;
  globalFilter: string;
  setGlobalFilter: any;
}

export function FantasyPicker(props: Props) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div className="flex flex-col p-2 lg:p-4 gap-2">
      {/* League Categories */}
      <div className={`sticky top-0 bg-secondary p-2`}>
        <PillButtons pills={props.filters} />
      </div>

      {/* Search Input */}
      <div className="px-2">
        <DebouncedInput
          value={props.globalFilter ?? ''}
          onChange={(value) => {
            props.setGlobalFilter(String(value));
          }}
          placeholder={'Search'}
          debounce={200}
          className={
            'block p-4 pl-10 w-full text-sm text-white rounded-lg border border-slate-500 bg-[#1A395B] focus:ring-2 focus:ring-white focus:border-white focus:outline-none'
          }
          iconClassName={'w-5 h-5 text-white'}
        />
      </div>

      {/* Fantasy Grid */}
      <div
        className={
          'grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-3 mt-2 px-2'
        }
      >
        {props.cards.map((card) => {
          const betLeg = props.legs?.find(
            (leg) =>
              `${leg!.marketId} ${leg!.freeSquare?.id || ''}` === card!.id,
          );
          const isSelected = !!betLeg;
          const isOver = betLeg?.team === 'over';

          return (
            <FantasyCard
              {...card}
              key={`${card.id}_${card.stat}`}
              imageSize={matches ? 'small' : 'medium'}
              isSelected={isSelected}
              isOver={isOver}
            />
          );
        })}
      </div>
    </div>
  );
}
