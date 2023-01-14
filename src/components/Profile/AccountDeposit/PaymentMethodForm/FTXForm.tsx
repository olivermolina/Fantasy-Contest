import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BillingAddressInputs } from '~/components/Profile/AccountDeposit/PaymentMethodForm/BillingAddressForm';
import { UserDetailsInput } from '~/lib/tsevo-gidx/GIDX';
import { PaymentMethodType } from '@prisma/client';
import { PaymentFormDataInterface } from '~/containers/ProfileAccountDepositContainer';
import { AccountDepositResponseInterface } from '~/server/routers/user/accountDeposit';

interface FTXFormProps {
  depositAmount: string;
  handleFTXNext: (
    data: PaymentFormDataInterface,
  ) => Promise<AccountDepositResponseInterface | undefined>;
  handleNext: (data?: PaymentFormDataInterface) => void;
  verifiedData?: UserDetailsInput;
}

const FTXForm = ({ verifiedData, handleFTXNext, handleNext }: FTXFormProps) => {
  const methods = useForm<BillingAddressInputs>();
  const { handleSubmit } = methods;
  const [transaction, setTransaction] = useState<any>();

  const onSubmit = async () => {
    if (!transaction) {
      const newTransaction = await handleFTXNext({
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
          type: PaymentMethodType.OTHERS,
        },
      });
      setTransaction(newTransaction);
      window.open(newTransaction?.url, '_newtab')?.focus();
      handleNext();
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-wrap gap-3 w-full p-5 justify-center"
        id="deposit-method-form"
        onSubmit={handleSubmit(onSubmit)}
      />
    </FormProvider>
  );
};

export default FTXForm;
