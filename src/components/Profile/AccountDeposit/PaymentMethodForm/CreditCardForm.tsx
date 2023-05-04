import React, { useEffect } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import valid from 'card-validator';
import { FormErrorText } from '~/components/Form/FormErrorText';
import { PatternFormat } from 'react-number-format';
import { CardTypes } from '~/constants/CardTypes';
import classNames from 'classnames';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import { UserDetailsInput } from '~/lib/tsevo-gidx/GIDX';
import { PaymentMethodFormsStyles } from './PaymentMethodForms.styles';
import BillingAddressForm, { BillingAddressInputs } from './BillingAddressForm';
import { ReactComponent } from '~/components/Icons/Icons';

export interface CreditCardInputs extends BillingAddressInputs {
  fullName: string;
  cardNumber: number | string;
  expireDate: string;
  cvv: number;
  token?: string;
}

interface CreditCardFormProps {
  paymentMethod: PaymentMethodInterface;
  onSubmit: SubmitHandler<CreditCardInputs>;
  handleChangePaymentMethod: (key: string) => void;
  verifiedData?: UserDetailsInput;
}

const InputValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Cardholder name is required'),
  cardNumber: Yup.string().when('token', {
    is: (exists: string) => !exists,
    then: Yup.string().test(
      'test-card-number',
      'Credit Card number is invalid',
      (value) => valid.number(value?.replace(/\s/g, '')).isValid,
    ),
    otherwise: Yup.string(),
  }),
  token: Yup.string(),
  expireDate: Yup.string().test(
    'test-card-expiry-date',
    'Credit Card expiry date is invalid',
    (value) => valid.expirationDate(value?.replace(/\s/g, '')).isValid,
  ),
  cvv: Yup.string().test(
    'test-card-cvv',
    'CVC/CVV is invalid',
    (value) => valid.cvv(value?.replace(/\s/g, '')).isValid,
  ),
  address1: Yup.string().required('Street Address is required '),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postalCode: Yup.string().required('Postal / postalCode code is required'),
});

const CreditCardForm = (props: CreditCardFormProps) => {
  const { paymentMethod, verifiedData } = props;
  const { image, key, savedPaymentMethod } = paymentMethod;
  const methods = useForm<CreditCardInputs>({
    resolver: yupResolver(InputValidationSchema),
  });

  const CardImage = image as ReactComponent;

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
      register('token', { required: true });
      reset({
        fullName: `${verifiedData?.firstname}  ${verifiedData?.lastname}`,
        address1: verifiedData?.address1,
        address2: verifiedData?.address2,
        city: verifiedData?.city,
        state: verifiedData?.state,
        postalCode: verifiedData?.postalCode,
        cardNumber: savedPaymentMethod?.CardNumber,
        expireDate: savedPaymentMethod?.ExpirationDate,
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
          <span className="mb-1 text-sm">Cardholder Name</span>
          <input
            className={PaymentMethodFormsStyles.billingInputs(
              errors.fullName?.message,
            )}
            type="text"
            {...register('fullName')}
          />
          <FormErrorText>{errors.fullName?.message}</FormErrorText>
        </label>
        <label className={PaymentMethodFormsStyles.flexElements}>
          <span className="mb-1 text-sm">Card number</span>
          {savedPaymentMethod ? (
            <input
              className={PaymentMethodFormsStyles.cardInputs(undefined)}
              value={savedPaymentMethod.CardNumber}
              disabled
            />
          ) : (
            <Controller
              control={control}
              name="cardNumber"
              render={({ field: { onChange, name, value } }) => (
                <PatternFormat
                  format={
                    key === CardTypes.amex
                      ? '#### #### #### ###'
                      : `#### #### #### ####`
                  }
                  mask="_"
                  className={PaymentMethodFormsStyles.cardInputs(
                    errors.cardNumber?.message,
                  )}
                  type="text"
                  placeholder={
                    key === CardTypes.amex
                      ? '0000 0000 0000 000'
                      : `0000 0000 0000 0000`
                  }
                  name={name}
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    const numberValidation = valid.number(
                      e.target.value?.replace(/\s/g, ''),
                    );
                    if (numberValidation.card) {
                      props.handleChangePaymentMethod(
                        numberValidation.card.type,
                      );
                    }
                    trigger(name);
                  }}
                />
              )}
            />
          )}

          <CardImage
            className={classNames(PaymentMethodFormsStyles.icons, {
              '-translate-y-7': errors.cardNumber?.message,
              '-translate-y-1/2': !errors.cardNumber?.message,
            })}
          />
          <FormErrorText>{errors.cardNumber?.message}</FormErrorText>
        </label>
        <label className={PaymentMethodFormsStyles.nonFullWidthElements}>
          <span className="mb-1 text-sm">Expire date</span>

          <Controller
            control={control}
            name="expireDate"
            render={({ field: { onChange, name, value } }) => (
              <div
                className={classNames(
                  'flex flex-row rounded-md peer p-2 border-2 bg-[#1A487F] gap-2 justify-center items-center',
                  {
                    'border-red-500 outline-red-500':
                      errors.expireDate?.message,
                    'border-gray-200 outline-blue-500':
                      !!errors.expireDate?.message,
                  },
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={'object-fit h-5 w-5'}
                >
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <PatternFormat
                  format="##/####"
                  mask="_"
                  className={'w-full bg-transparent outline-0'}
                  type="text"
                  placeholder="MM/YYYY"
                  name={name}
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    trigger(name);
                  }}
                />
              </div>
            )}
          />

          <FormErrorText>{errors.expireDate?.message}</FormErrorText>
        </label>
        <label className={PaymentMethodFormsStyles.nonFullWidthElements}>
          <span className="flex items-center gap-3 mb-1 text-sm">
            CVC/CVV
            <span className="relative group">
              <span className="hidden group-hover:flex justify-center items-center px-2 py-1 text-xs absolute -right-2 w-max top-1/2 bg-black text-white">
                {' '}
                Security code
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </span>
          <Controller
            control={control}
            name="cvv"
            render={({ field: { onChange, name, value } }) => (
              <div
                className={classNames(
                  'flex flex-row rounded-md peer p-2 border-2 bg-[#1A487F] gap-2 justify-center items-center',
                  {
                    'border-red-500 outline-red-500': errors.cvv?.message,
                    'border-gray-200 outline-blue-500': !!errors.cvv?.message,
                  },
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>

                <PatternFormat
                  format="###"
                  mask="_"
                  className={'w-full bg-transparent outline-0'}
                  type="text"
                  placeholder="&bull;&bull;&bull;"
                  name={name}
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    trigger(name);
                  }}
                />
              </div>
            )}
          />

          <FormErrorText>{errors.cvv?.message}</FormErrorText>
        </label>

        {!savedPaymentMethod ? <BillingAddressForm /> : null}
      </form>
    </FormProvider>
  );
};

export default CreditCardForm;
