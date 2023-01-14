import React from 'react';
import classNames from 'classnames';
import { GIDXPaymentMethod } from '~/lib/tsevo-gidx/GIDX';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import { PaymentMethodType } from '@prisma/client';
import CreditCard from '~/assets/credit-card.svg';
import ACH from '~/assets/ach.svg';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  paymentMethods: PaymentMethodInterface[];
  paymentMethod: GIDXPaymentMethod;
  selectedPaymentMethod?: PaymentMethodInterface;
  onPaymentSelect?: (selectedPaymentMethod: PaymentMethodInterface) => void;
  onDeletePaymentMethod: (paymentMethod: GIDXPaymentMethod) => void;
}

const SavePaymentMethodCard = (props: Props) => {
  const {
    paymentMethod,
    paymentMethods,
    selectedPaymentMethod,
    onPaymentSelect,
    onDeletePaymentMethod,
  } = props;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    setOpen(false);
    if (paymentMethod) {
      onDeletePaymentMethod(paymentMethod);
    }
  };

  return (
    <>
      <div
        key={paymentMethod.Token}
        className={classNames(
          `flex flex-col justify-between p-2 shadow-md rounded-lg cursor-pointer transform transition duration-500 hover:scale-y-100 hover:border-4 hover:border-blue-300 min-h-[107px] min-w-[170px] relative`,
          {
            'border-4 border-blue-300':
              selectedPaymentMethod?.key === paymentMethod?.Token,
          },
        )}
        onClick={() => {
          const selectedPaymentMethod = paymentMethods.find(
            (row) => row.type === paymentMethod.Type,
          );
          if (selectedPaymentMethod) {
            onPaymentSelect?.({
              key: paymentMethod.Token,
              type: paymentMethod.Type as PaymentMethodType,
              image: CreditCard,
              savedPaymentMethod: paymentMethod,
            });
          }
        }}
      >
        {paymentMethod?.Type === PaymentMethodType.CC && (
          <div>
            <CreditCard height={35} width={35} />
            <p>Card: {paymentMethod.DisplayName}</p>
            <p>Expiry Date: {paymentMethod.ExpirationDate}</p>
          </div>
        )}
        {paymentMethod?.Type === PaymentMethodType.ACH && (
          <div>
            <ACH height={35} width={35} />
            <p>Account: {paymentMethod.DisplayName}</p>
            <p>Routing: {paymentMethod.RoutingNumber}</p>
          </div>
        )}
        <IconButton
          sx={{ top: 1, right: 1, position: 'absolute' }}
          size="small"
          onClick={handleClickOpen}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'xs'}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              'Are you sure you want to permanently remove the selected payment method?'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus variant={'outlined'}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant={'contained'}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SavePaymentMethodCard;
