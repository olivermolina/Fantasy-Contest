import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  /**
   * Callback function to delete referral code
   * @param referralCode
   */
  confirmDelete: (referralCode: string) => void;
  /**
   * Callback function to close delete referral code dialog
   */
  closeDialog: () => void;
  /**
   * Boolean to show delete referral code dialog
   */
  open: boolean;
  /**
   * Referral code to delete
   */
  referral: string;
}

export default function DeleteDialog(props: Props) {
  const { closeDialog, open, confirmDelete, referral } = props;

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {'Delete Referral Code?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete{' '}
          <span className={'font-semibold'}>{`'${referral}'`}</span> referral
          code?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button
          onClick={() => confirmDelete(referral)}
          variant={'outlined'}
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
