import React from 'react';
import CreditCardForm, { CreditCardInputs } from './CreditCardForm';
import ACHForm, { AchInputs } from './ACHForm';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import { SubmitHandler } from 'react-hook-form';
import { UserDetailsInput } from '~/lib/tsevo-gidx/GIDX';
import { PaymentMethodType } from '@prisma/client';
import PaypalForm from './PaypalForm';
import { PaymentFormDataInterface } from '~/containers/ProfileAccountDepositContainer';
import { AccountDepositResponseInterface } from '~/server/routers/user/accountDeposit';

interface Props {
  onSubmit: SubmitHandler<CreditCardInputs | AchInputs>;
  handleChangePaymentMethod: (key: string) => void;
  selectedPaymentMethod?: PaymentMethodInterface;
  verifiedData?: UserDetailsInput;
  depositAmount: number;
  handlePaypalNext: (
    data: PaymentFormDataInterface,
  ) => Promise<AccountDepositResponseInterface | undefined>;
  handleNext: (data?: PaymentFormDataInterface) => void;
}

const PaymentMethodForm = (props: Props) => {
  const {
    selectedPaymentMethod,
    onSubmit,
    handleChangePaymentMethod,
    verifiedData,
    handlePaypalNext,
    handleNext,
  } = props;

  if (!selectedPaymentMethod) return null;

  return (
    <div className={'w-full '}>
      {selectedPaymentMethod?.type === PaymentMethodType.CC ? (
        <CreditCardForm
          paymentMethod={selectedPaymentMethod}
          onSubmit={onSubmit}
          handleChangePaymentMethod={handleChangePaymentMethod}
          verifiedData={verifiedData}
        />
      ) : null}

      {selectedPaymentMethod?.type === PaymentMethodType.ACH ? (
        <ACHForm
          paymentMethod={selectedPaymentMethod}
          onSubmit={onSubmit}
          verifiedData={verifiedData}
        />
      ) : null}

      {selectedPaymentMethod?.type === PaymentMethodType.Paypal ? (
        <PaypalForm
          depositAmount={props.depositAmount.toString()}
          handlePaypalNext={handlePaypalNext}
          verifiedData={verifiedData}
          handleNext={handleNext}
        />
      ) : null}
    </div>
  );
};

export default PaymentMethodForm;
