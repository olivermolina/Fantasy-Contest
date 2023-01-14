import React from 'react';
import { PillButtons, PillButtonsProps } from '../PillButtons/PillButtons';
import { FantasyCard, FantasyCardProps } from './FantasyCard';
import { Grid } from '@mui/material';
import { BetModel } from '~/state/bets';

interface Props extends React.PropsWithChildren {
  filters: PillButtonsProps['pills'];
  cards: FantasyCardProps[];
  legs?: BetModel[];
}

export function FantasyPicker(props: Props) {
  return (
    <div className="pb-2">
      <PillButtons pills={props.filters} />
      {/* Fantasy Grid */}
      <Grid container spacing={2} sx={{ mt: 1 }} alignItems="flex-start">
        {props.cards.map((card) => {
          const filterSelected = props.filters?.find(
            (filter) => filter.selected,
          );
          const betLeg = props.legs?.find(
            (leg) =>
              leg.name === card.playerName &&
              filterSelected?.name === leg.statName,
          );
          const isSelected = !!betLeg;
          const isOver = betLeg?.team === 'over';

          return (
            <Grid
              item
              key={`${card.playerName}_${card.matchTime}`}
              xs={12}
              sm={6}
              lg={4}
              xl={3}
            >
              <FantasyCard
                {...card}
                imageSize={'small'}
                isSelected={isSelected}
                isOver={isOver}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
