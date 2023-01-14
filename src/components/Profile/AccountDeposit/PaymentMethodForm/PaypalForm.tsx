import React, { useEffect, useState } from 'react';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { FormProvider, useForm } from 'react-hook-form';
import { BillingAddressInputs } from '~/components/Profile/AccountDeposit/PaymentMethodForm/BillingAddressForm';
import { UserDetailsInput } from '~/lib/tsevo-gidx/GIDX';
import { PaymentMethodType } from '@prisma/client';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PaymentFormDataInterface } from '~/containers/ProfileAccountDepositContainer';
import { AccountDepositResponseInterface } from '~/server/routers/user/accountDeposit';

interface PaypalButtonWrapperProps {
  currency: string;
  showSpinner: boolean;
  amount: string;
  getPaypalOrder: () => Promise<string>;
  handleSuccess: () => void;
}

const style = { layout: 'vertical' };

// Custom component to wrap the PayPalButtons and handle currency changes
const PaypalButtonWrapper = ({
  currency,
  showSpinner,
  amount,
  getPaypalOrder,
  handleSuccess,
}: PaypalButtonWrapperProps) => {
  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
  // This is the main reason to wrap the PayPalButtons in a new component
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner]);

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={{ layout: 'vertical' }}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={() => {
          return getPaypalOrder().then((orderId) => {
            return orderId;
          });
        }}
        onApprove={async () => {
          handleSuccess();
        }}
      />
    </>
  );
};

export interface PaypalInputs extends BillingAddressInputs {
  clientId: string;
  orderId: string;
}

interface PaypalFormProps {
  depositAmount: string;
  handlePaypalNext: (
    data: PaymentFormDataInterface,
  ) => Promise<AccountDepositResponseInterface | undefined>;
  handleNext: (data?: PaymentFormDataInterface) => void;
  verifiedData?: UserDetailsInput;
}

const PaypalForm = ({
  depositAmount,
  verifiedData,
  handlePaypalNext,
  handleNext,
}: PaypalFormProps) => {
  const methods = useForm<PaypalInputs>();
  const { handleSubmit } = methods;
  const [transaction, setTransaction] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => setOpen(false);

  const handleSuccess = () => {
    handleClose();
    handleNext();
  };

  const onSubmit = async () => {
    if (!transaction) {
      const newTransaction = await handlePaypalNext({
        fullName: `${verifiedData?.firstname}  ${verifiedData?.lastname}`,
        billingAddress: {
          address1: verifiedData?.address1,
          address2: verifiedData?.address2,
          city: verifiedData?.city,
          state: verifiedData?.state,
          postalCode: verifiedData?.postalCode,
          countyCode: 'US',
        },
        paymentMethod: {
          type: PaymentMethodType.Paypal,
        },
      });
      setTransaction(newTransaction);
    }
    setOpen(true);
  };

  const getPaypalOrder = async () => {
    return transaction?.orderId.toString() || '';
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-wrap gap-3 w-full p-5 justify-center"
        id="deposit-method-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {transaction ? (
          <Dialog open={open}>
            <DialogTitle sx={{ m: 0 }}>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 3 }}>
              <PayPalScriptProvider
                options={{ 'client-id': transaction.paypalClientId }}
              >
                <PaypalButtonWrapper
                  currency={'USD'}
                  amount={depositAmount.toString()}
                  showSpinner={true}
                  getPaypalOrder={getPaypalOrder}
                  handleSuccess={handleSuccess}
                />
              </PayPalScriptProvider>
            </DialogContent>
          </Dialog>
        ) : null}
      </form>
    </FormProvider>
  );
};

export default PaypalForm;
