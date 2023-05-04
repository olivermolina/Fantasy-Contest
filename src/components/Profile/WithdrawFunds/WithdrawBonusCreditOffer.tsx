import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { showDollarPrefix } from '~/utils/showDollarPrefix';

interface Props {
  /**
   * Callback function to confirm the offer
   */
  handleSubmit: (cashBalance: number, bonusCredit: number) => void;
  /**
   * Callback function to proceed into the next steps to withdraw cash
   */
  handleNext: () => void;
  /**
   * Boolean to show the offer dialog message
   * @example
   */
  open: boolean;
  /**
   * Callback function to handle the show/close the offer dialog
   */
  setOpen: (open: boolean) => void;
  /**
   * Max bonus credit that the user can get from the offer
   * @example 1000
   */
  maxRetentionBonus: number;
  /**
   * Bonus credit match multiplier
   * @example 2
   */
  retentionBonusMatchMultiplier: number;
  /**
   * User's available withdrawable amount
   * @example 2
   */
  cashBalance: number;
}

/**
 * A withdrawal offer dialog that shows a bonus credit to the user
 * when they keep their money on the platform
 */
export default function WithdrawBonusCreditOffer(props: Props) {
  const {
    handleSubmit,
    handleNext,
    open,
    setOpen,
    cashBalance,
    retentionBonusMatchMultiplier,
    maxRetentionBonus,
  } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    handleNext();
    handleClose();
  };

  const matchBonusCredit = cashBalance * retentionBonusMatchMultiplier;
  const finalBonusCredit =
    matchBonusCredit > maxRetentionBonus ? maxRetentionBonus : matchBonusCredit;
  const totalBonusCredit = finalBonusCredit + cashBalance;

  const handleConfirm = () => {
    handleClose();
    handleSubmit(cashBalance, totalBonusCredit);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Before you Withdraw Bonus Credit Offer!
      </DialogTitle>
      <DialogContent>
        We will offer you{' '}
        <span className="font-semibold">
          {showDollarPrefix(totalBonusCredit, true)}
        </span>{' '}
        in <span className="font-semibold">BONUS CREDIT</span> if you keep your
        money on the platform to play! By pressing confirm we will convert all
        your Cash Balance{' '}
        <span className="font-semibold">
          ({showDollarPrefix(cashBalance, true)})
        </span>{' '}
        to Bonus Credit and add an additional{' '}
        <span className="font-semibold">
          {showDollarPrefix(finalBonusCredit, true)}
        </span>
        !
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleConfirm} variant={'contained'} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
