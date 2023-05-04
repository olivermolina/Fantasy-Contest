import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FreePlayRowModel } from '~/components/Pages/Admin/FreePlayBonusCredit/FreePlayUserBonusCreditsTable';

interface Props {
  handleDelete: (row: FreePlayRowModel) => void;
  row?: FreePlayRowModel;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CancelFreePlayConfirmDialog(props: Props) {
  const { handleDelete, row, open, setOpen } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    handleClose();
    if (row) {
      handleDelete(row);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {'Cancel Free Play Bonus Credit?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to free play bonus credit{' '}
          <span className={'font-semibold'}>${row?.amountBonus}</span>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant={'outlined'}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant={'contained'} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
