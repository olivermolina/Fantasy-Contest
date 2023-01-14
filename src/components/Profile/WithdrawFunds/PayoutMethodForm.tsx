import React, { useMemo, useState } from 'react';
import { PaymentMethodType } from '@prisma/client';
import ACHForm, {
  AchInputs,
} from '~/components/Profile/AccountDeposit/PaymentMethodForm/ACHForm';
import { SubmitHandler } from 'react-hook-form';
import { Card, CardActions, CardContent, Dialog } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { GIDXPaymentMethod, UserDetailsInput } from '~/lib/tsevo-gidx/GIDX';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import SavedPaymentMethodCardList from '~/components/Profile/AccountDeposit/SavedPaymentMethodCardList';
import { PAYMENT_METHODS } from '~/containers/ProfileAccountDepositContainer';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { PaymentMethodFormsStyles } from '~/components/Profile/AccountDeposit/PaymentMethodForm/PaymentMethodForms.styles';
import { UserDetails } from '~/state/profile';

interface Props {
  verifiedData?: UserDetailsInput;
  payoutAmount: number;
  handleBack: () => void;
  handleCancel: () => void;
  selectedPayoutMethod?: PaymentMethodInterface;
  savedPaymentMethods?: GIDXPaymentMethod[];
  onPaymentSelect: (selectedPaymentMethod: PaymentMethodInterface) => void;
  selectedPaymentMethod?: PaymentMethodInterface;
  handleSavePaymentMethod: (data: AchInputs, save: boolean) => void;
  isLoading: boolean;
  user?: UserDetails;
}

const PayoutMethodForm = (props: Props) => {
  const {
    handleBack,
    payoutAmount,
    handleCancel,
    savedPaymentMethods,
    selectedPaymentMethod,
    selectedPayoutMethod,
    verifiedData,
    onPaymentSelect,
    handleSavePaymentMethod,
    isLoading,
    user,
  } = props;

  const achPaymentMethods = useMemo(
    () =>
      savedPaymentMethods?.filter(
        (savedPaymentMethod) =>
          savedPaymentMethod.Type === PaymentMethodType.ACH,
      ) || [],
    [savedPaymentMethods],
  );

  const onSubmitPaymentMethod: SubmitHandler<AchInputs> = async (data) => {
    await handleSavePaymentMethod(data, true);
    handleClose();
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeletePaymentMethod = async (
    paymentMethod: GIDXPaymentMethod,
  ) => {
    await handleSavePaymentMethod(
      {
        fullName: verifiedData?.firstname || '',
        token: paymentMethod.Token,
        accountNumber: '',
        routingNumber: '',
      },
      false,
    );
  };

  return (
    <div>
      <div className="flex gap-1 mb-5">
        <span className={'font-bold text-sm'}>$</span>
        <div>
          <p className="font-bold text-3xl">{payoutAmount?.toFixed(2)}</p>
          <p className={'text-gray-400 text-sm'}>
            <a
              href={void 0}
              className="no-underline hover:underline cursor-pointer"
              onClick={handleBack}
            >
              Return
            </a>
            <span> / </span>
            <a
              href={void 0}
              className="no-underline hover:underline cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </a>
          </p>
        </div>
      </div>
      {selectedPayoutMethod?.key === PaymentMethodType.ACH ? (
        <div className={'mt-5'}>
          <SavedPaymentMethodCardList
            paymentMethods={PAYMENT_METHODS}
            onPaymentSelect={onPaymentSelect}
            selectedPaymentMethod={selectedPaymentMethod}
            savedPaymentMethods={achPaymentMethods}
            showAddButton={!isLoading && achPaymentMethods?.length < 5}
            handleAdd={handleOpen}
            onDeletePaymentMethod={handleDeletePaymentMethod}
            isLoading={isLoading}
          />

          {!isLoading && !achPaymentMethods?.length && (
            <div className={'flex flex-col items-center justify-center gap-2'}>
              <AccountBalanceIcon />
              <p className={'font-bold text-sm'}>
                You do no currently have a payout method setup.
              </p>
              <p className={'text-sm'}>
                {' '}
                Add a payout method to receive payouts.
              </p>
              <button
                className="p-2 capitalize text-white rounded font-bold w-auto h-auto bg-blue-600 disabled:opacity-50"
                onClick={handleOpen}
              >
                Add Payout Method
              </button>
            </div>
          )}

          <Dialog open={open} fullWidth maxWidth={'md'}>
            <Card
              className={'flex h-full w-full'}
              sx={{
                '&.MuiCard-root': {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                },
              }}
            >
              <CardHeader
                className={'bg-blue-600'}
                sx={{
                  color: '#fff',
                  textAlign: 'center',
                }}
                action={
                  <IconButton aria-label="settings" onClick={handleClose}>
                    <CloseOutlinedIcon sx={{ color: '#fff', fontSize: 40 }} />
                  </IconButton>
                }
                title={'Add Payout Method'}
              />
              <CardContent className={'overflow-y-auto'}>
                <ACHForm
                  paymentMethod={selectedPayoutMethod}
                  onSubmit={onSubmitPaymentMethod}
                  verifiedData={verifiedData}
                />
              </CardContent>
              <CardActions style={{ justifyContent: 'center' }}>
                <button
                  className="p-4 capitalize text-white rounded font-bold w-screen h-auto bg-blue-600 disabled:opacity-50"
                  type={'submit'}
                  form="deposit-method-form"
                  disabled={isLoading}
                >
                  Add
                </button>
              </CardActions>
            </Card>
          </Dialog>
        </div>
      ) : null}

      {selectedPayoutMethod?.key === PaymentMethodType.Paypal ? (
        <div className="flex flex-wrap w-full" id="deposit-method-form">
          <label className={PaymentMethodFormsStyles.flexElements}>
            <span className="mb-1 font-bold text-md">Paypal Email Address</span>
            <input
              className={PaymentMethodFormsStyles.billingInputs('')}
              type="text"
              disabled
              value={user?.email}
            />
          </label>
        </div>
      ) : null}
    </div>
  );
};

export default PayoutMethodForm;
