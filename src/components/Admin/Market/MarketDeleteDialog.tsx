import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Market } from '@prisma/client';
import { MarketWithPlayerTeam } from '~/components/Admin/Market/Markets';

interface Props {
  handleDelete: (market: Market) => void;
  market: MarketWithPlayerTeam;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MarketDeleteDialog(props: Props) {
  const { handleDelete, market, open, setOpen } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    handleClose();
    handleDelete(market);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Delete Market?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to remove {market?.name}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant={'outlined'} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
