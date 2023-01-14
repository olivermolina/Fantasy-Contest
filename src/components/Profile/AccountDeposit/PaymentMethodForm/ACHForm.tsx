import React, { useEffect } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FormErrorText } from '~/components/Form/FormErrorText';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import { UserDetailsInput } from '~/lib/tsevo-gidx/GIDX';
import { PaymentMethodFormsStyles } from './PaymentMethodForms.styles';
import BillingAddressForm, { BillingAddressInputs } from './BillingAddressForm';
import { accountNumber, routingNumber } from 'us-bank-account-validator';

export interface AchInputs extends BillingAddressInputs {
  fullName: string;
  accountNumber: number | string;
  routingNumber: number | string;
  token?: string;
}

interface ACHFormProps {
  onSubmit: SubmitHandler<AchInputs>;
  paymentMethod?: PaymentMethodInterface;
  verifiedData?: UserDetailsInput;
}

const InputValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Account name is required'),
  accountNumber: Yup.string().when('token', {
    is: (exists: string) => !exists,
    then: Yup.string().test(
      'test-account-number',
      'Account number is invalid',
      (value) => accountNumber(value?.replace(/\s/g, '')).isValid,
    ),
    otherwise: Yup.string(),
  }),
  routingNumber: Yup.string().test(
    'test-routing-number',
    'Routing number is invalid',
    (value) => routingNumber(value?.replace(/\s/g, '')).isValid,
  ),
  token: Yup.string(),
});
const ACHForm = (props: ACHFormProps) => {
  const { verifiedData, paymentMethod } = props;
  const methods = useForm<AchInputs>({
    resolver: yupResolver(InputValidationSchema),
  });

  const savedPaymentMethod = paymentMethod?.savedPaymentMethod;

  const {
    register,
    formState: { errors },
    trigger,
    control,
    handleSubmit,
    reset,
  } = methods;

  useEffect(() => {
    if (verifiedData) {
      reset({
        fullName: `${verifiedData?.firstname}  ${verifiedData?.lastname}`,
        address1: verifiedData?.address1,
        address2: verifiedData?.address2,
        city: verifiedData?.city,
        state: verifiedData?.state,
        postalCode: verifiedData?.postalCode,
        accountNumber: savedPaymentMethod?.AccountNumber,
        routingNumber: savedPaymentMethod?.RoutingNumber,
        token: savedPaymentMethod?.Token,
      });
    }
  }, [verifiedData, savedPaymentMethod]);

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-wrap gap-3 w-full p-5"
        id="deposit-method-form"
        onSubmit={handleSubmit(props.onSubmit)}
      >
        <label className={PaymentMethodFormsStyles.flexElements}>
          <span className="mb-1 font-bold text-md">Acount Name</span>
          <input
            className={PaymentMethodFormsStyles.billingInputs(
              errors.fullName?.message,
            )}
            type="text"
            {...register('fullName')}
          />
          <FormErrorText>{errors.fullName?.message}</FormErrorText>
        </label>
        <label className={PaymentMethodFormsStyles.nonFullWidthElements}>
          <span className="mb-1 font-bold text-md">Account Number</span>
          {savedPaymentMethod ? (
            <input
              className={PaymentMethodFormsStyles.achInputs(undefined)}
              value={savedPaymentMethod.AccountNumber}
              disabled
            />
          ) : (
            <Controller
              control={control}
              name="accountNumber"
              render={({ field: { onChange, name, value } }) => (
                <NumericFormat
                  className={PaymentMethodFormsStyles.achInputs(
                    errors.accountNumber?.message,
                  )}
                  type="text"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                  name={name}
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    trigger(name);
                  }}
                />
              )}
            />
          )}

          <FormErrorText>{errors.accountNumber?.message}</FormErrorText>
        </label>
        <label className={PaymentMethodFormsStyles.nonFullWidthElements}>
          <span className="flex items-center gap-3 mb-1 font-bold text-md">
            Routing Number
          </span>
          <Controller
            control={control}
            name="routingNumber"
            render={({ field: { onChange, name, value } }) => (
              <PatternFormat
                format="### ### ###"
                mask="_"
                className={PaymentMethodFormsStyles.achInputs(
                  errors.routingNumber?.message,
                )}
                disabled={!!savedPaymentMethod}
                type="text"
                placeholder="&bull;&bull;&bull; &bull;&bull;&bull; &bull;&bull;&bull;"
                name={name}
                value={value}
                onChange={(e) => {
                  onChange(e);
                  trigger(name);
                }}
              />
            )}
          />
          <FormErrorText>{errors.routingNumber?.message}</FormErrorText>
        </label>

        {!savedPaymentMethod ? <BillingAddressForm /> : null}
      </form>
    </FormProvider>
  );
};

export default ACHForm;
