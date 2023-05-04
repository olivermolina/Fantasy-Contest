import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  freeSquareId?: string;
  handleDelete: (freeSquareId: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DeleteConfirmationDialog(props: Props) {
  const { handleDelete, open, setOpen, freeSquareId } = props;

  const closeDialog = () => {
    setOpen(false);
  };

  const confirmDelete = () => {
    closeDialog();
    if (freeSquareId) {
      handleDelete(freeSquareId);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {'Delete Free Square Promotion?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to remove free square promotion?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={confirmDelete} variant={'outlined'} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
