import React from 'react';
import { ContestCategory } from '@prisma/client';
import { Paper, Stack } from '@mui/material';

import { grey } from '@mui/material/colors';

interface Props {
  category: ContestCategory;
  isSelected: boolean;
  handleClick: (category: ContestCategory) => void;
}

const ContestPickerCategoryCard = (props: Props) => {
  return (
    <Paper
      sx={{
        borderRadius: 1,
        backgroundColor: props.isSelected ? '#fff' : grey[200],
        width: 100,
        py: 0.5,
        cursor: 'pointer',
      }}
    >
      <Stack
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        onClick={() => props.handleClick(props.category)}
        spacing={0.2}
      >
        <span className="font-bold text-md">
          {props.category.numberOfPicks} Picks
        </span>
        <span className="text-sm">
          {props.category.allInPayoutMultiplier}x Payout
        </span>
        <span className="text-sm">
          {props.category.numberOfPicks}/{props.category.numberOfPicks} Correct
        </span>
      </Stack>
    </Paper>
  );
};

export default ContestPickerCategoryCard;
