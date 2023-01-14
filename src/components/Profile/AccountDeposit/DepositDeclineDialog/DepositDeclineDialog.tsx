import React from 'react';
import { Dialog } from '@mui/material';
import CreditCardDepositDecline from './CreditCardDepositDecline';
import { PaymentMethodType } from '@prisma/client';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  type?: PaymentMethodType;
  errorCode?: string | number;
  errorMessage?: string;
}

export default function DepositDeclineDialog(props: Props) {
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <Dialog open={props.open} sx={{ top: 65 }}>
      {props.type === PaymentMethodType.CC && (
        <CreditCardDepositDecline
          handleClose={handleClose}
          errorCode={props.errorCode}
          errorMessage={props.errorMessage}
        />
      )}
    </Dialog>
  );
}
