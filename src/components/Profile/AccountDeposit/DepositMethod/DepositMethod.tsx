import React, { useEffect, useState } from 'react';
import PaymentMethodForm from '~/components/Profile/AccountDeposit/PaymentMethodForm';
import { SubmitHandler } from 'react-hook-form';
import { CreditCardInputs } from '~/components/Profile/AccountDeposit/PaymentMethodForm/CreditCardForm';
import classNames from 'classnames';
import { ReactComponent } from '~/components/Icons/Icons';
import { GIDXPaymentMethod, UserDetailsInput } from '~/lib/tsevo-gidx/GIDX';
import { PaymentFormDataInterface } from '~/containers/ProfileAccountDepositContainer';
import { AchInputs } from '~/components/Profile/AccountDeposit/PaymentMethodForm/ACHForm';
import { PaymentMethodType } from '@prisma/client';
import PaymentMethodRadioButtonsGroup, {
  PaymentMethodRadioOptions,
} from '~/components/Profile/AccountDeposit/DepositMethod/PaymentMethodRadioButtonsGroup';
import { Grid } from '@mui/material';
import SavedPaymentMethodCardList from '~/components/Profile/AccountDeposit/SavedPaymentMethodCardList';
import { AccountDepositResponseInterface } from '~/server/routers/user/accountDeposit';

export interface PaymentMethodInterface {
  key: string;
  image: ReactComponent | JSX.Element;
  type: PaymentMethodType;
  label?: string;
  savedPaymentMethod?: GIDXPaymentMethod;
}

interface DepositMethodProps {
  depositAmount: number;
  handleBack: () => void;
  handleNext: (data?: PaymentFormDataInterface) => void;
  paymentMethods: PaymentMethodInterface[];
  selectedPaymentMethod?: PaymentMethodInterface;
  onPaymentSelect?: (selectedPaymentMethod?: PaymentMethodInterface) => void;
  verifiedData?: UserDetailsInput;
  handleCancel: () => void;
  savedPaymentMethods?: GIDXPaymentMethod[];
  handlePaypalNext: (
    data: PaymentFormDataInterface,
  ) => Promise<AccountDepositResponseInterface | undefined>;
  handleDeletePaymentMethod: (paymentMethod: GIDXPaymentMethod) => void;
  isLoading: boolean;
}

const DepositMethod = (props: DepositMethodProps) => {
  const {
    depositAmount,
    handleBack,
    handleNext,
    paymentMethods,
    onPaymentSelect,
    handleCancel,
    selectedPaymentMethod,
    savedPaymentMethods,
    verifiedData,
    handlePaypalNext,
    handleDeletePaymentMethod,
    isLoading,
  } = props;

  const onSubmit: SubmitHandler<CreditCardInputs | AchInputs> = async (
    data,
  ) => {
    await handleNext?.({
      fullName:
        data?.fullName ||
        `${verifiedData?.firstname}  ${verifiedData?.lastname}`,
      billingAddress: {
        address1: data?.address1 || verifiedData?.address1,
        address2: data?.address2 || verifiedData?.address2,
        city: data?.city || verifiedData?.city,
        state: data?.state || verifiedData?.state,
        postalCode: data?.postalCode || verifiedData?.postalCode,
        countyCode: 'US',
      },
      paymentMethod: {
        type: selectedPaymentMethod?.type,
        ...(selectedPaymentMethod?.type === PaymentMethodType.CC && {
          creditCard: {
            token: (data as CreditCardInputs).token,
            cardNumber: (data as CreditCardInputs).cardNumber
              .toString()
              .replaceAll(/\s/g, ''),
            cardExpirationDate: (data as CreditCardInputs).expireDate,
            cvv: (data as CreditCardInputs).cvv,
            cardType: selectedPaymentMethod?.key,
          },
        }),
        ...(selectedPaymentMethod?.type === PaymentMethodType.ACH && {
          ach: {
            token: (data as AchInputs).token,
            accountNumber: (data as AchInputs).accountNumber
              .toString()
              .replaceAll(/\s/g, ''),
            routingNumber: (data as AchInputs).routingNumber
              .toString()
              .replaceAll(/\s/g, ''),
          },
        }),
      },
    });
  };

  const onDeletePaymentMethod = async (paymentMethod: GIDXPaymentMethod) => {
    await handleDeletePaymentMethod?.(paymentMethod);
  };

  const handleChangePaymentMethod = async (key: string) => {
    const newPaymentMethod = paymentMethods.find(
      (paymentMethod) => paymentMethod.key === key,
    );
    if (newPaymentMethod) onPaymentSelect?.(newPaymentMethod);
  };

  const [paymentMethodOption, setPaymentMethodOption] =
    useState<PaymentMethodRadioOptions>(PaymentMethodRadioOptions.SAVED);

  useEffect(() => {
    onPaymentSelect?.(undefined);
  }, [paymentMethodOption]);

  return (
    <div className="flex flex-col shadow-md rounded-md divide-y gap-2 bg-primary">
      <div className="flex flex-col p-6 gap-2">
        <p className="font-bold text-lg">
          Select deposit method below to continue Deposit
        </p>
        <div className="flex gap-1">
          <span className={'font-bold text-sm'}>$</span>
          <div>
            <p className="font-bold text-3xl">{depositAmount.toFixed(2)}</p>
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
        <div>
          <PaymentMethodRadioButtonsGroup
            selectedPaymentMethodOptionCallback={setPaymentMethodOption}
          />
        </div>

        {paymentMethodOption === PaymentMethodRadioOptions.SAVED && (
          <SavedPaymentMethodCardList
            paymentMethods={paymentMethods}
            onPaymentSelect={onPaymentSelect}
            selectedPaymentMethod={selectedPaymentMethod}
            savedPaymentMethods={savedPaymentMethods}
            onDeletePaymentMethod={onDeletePaymentMethod}
            isLoading={isLoading}
          />
        )}

        {paymentMethodOption === PaymentMethodRadioOptions.NEW && (
          <Grid
            container
            direction="row"
            justifyContent={{ xs: 'space-evenly', md: 'flex-start' }}
            alignItems="center"
            spacing={4}
          >
            {paymentMethods.map((paymentMethod) => {
              const Image = paymentMethod.image as ReactComponent;
              return (
                <Grid item key={paymentMethod.key}>
                  <Image
                    className={classNames(
                      `shadow-md rounded-lg cursor-pointer transform transition duration-500 hover:scale-y-100 hover:border-4 hover:border-blue-300`,
                      {
                        'border-4 border-blue-300':
                          selectedPaymentMethod?.key === paymentMethod?.key,
                      },
                    )}
                    width={94}
                    height={64}
                    onClick={() => onPaymentSelect?.(paymentMethod)}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}

        {selectedPaymentMethod?.type === PaymentMethodType.ACH && (
          <p className={'text-lg font-semibold mt-2'}>
            NOTE: It may take up to 3-5 business days to process.
          </p>
        )}
      </div>

      <PaymentMethodForm
        selectedPaymentMethod={selectedPaymentMethod}
        handleChangePaymentMethod={handleChangePaymentMethod}
        verifiedData={verifiedData}
        onSubmit={onSubmit}
        depositAmount={depositAmount}
        handlePaypalNext={handlePaypalNext}
        handleNext={handleNext}
      />
      <div className="flex flex-col p-6 gap-2">
        <button
          className="p-4 capitalize bg-white text-primary rounded font-bold w-auto h-auto disabled:opacity-10"
          type="submit"
          disabled={!selectedPaymentMethod}
          form="deposit-method-form"
        >
          Deposit
        </button>
      </div>
    </div>
  );
};

export default DepositMethod;
