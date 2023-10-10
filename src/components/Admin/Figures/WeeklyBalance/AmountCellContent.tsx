import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import React from 'react';

export default function AmountCellContent(props: {
  amount: number;
  onClick?: () => void;
}) {
  if (props.amount === 0 && !props.onClick) {
    return (
      <Box>
        <span>{props.amount.toFixed(2)}</span>
      </Box>
    );
  }
  if (!props.onClick) {
    return (
      <Box
        sx={{
          color:
            props.amount !== 0 ? (props.amount > 0 ? 'green' : 'red') : 'black',
        }}
      >
        <span>{props.amount?.toFixed(2)}</span>
      </Box>
    );
  }

  return (
    <Link
      component="button"
      underline={'hover'}
      sx={{
        color:
          props.amount !== 0 ? (props.amount > 0 ? 'green' : 'red') : 'black',
      }}
      onClick={props.onClick}
    >
      <span>{props.amount?.toFixed(2)}</span>
    </Link>
  );
}
