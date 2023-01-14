import React from 'react';
import { Dialog } from '@mui/material';
import EnableLocation from './EnableLocation';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleEnableLocation: () => void;
}

export default function EnableLocationDialog({
  open,
  setOpen,
  handleEnableLocation,
}: Props) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      fullScreen={!matches}
      fullWidth
      maxWidth={'md'}
      sx={{ top: 65 }}
    >
      <EnableLocation
        handleClose={handleClose}
        handleEnableLocation={handleEnableLocation}
      />
    </Dialog>
  );
}
