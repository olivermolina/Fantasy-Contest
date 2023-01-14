import React from 'react';
import classNames from 'classnames';
import { FormErrorText } from '~/components/Form/FormErrorText';
import { PaymentMethodFormsStyles } from './PaymentMethodForms.styles';
import { useFormContext } from 'react-hook-form';

export interface BillingAddressInputs {
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

const BillingAddressForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<BillingAddressInputs>();
  return (
    <>
      <p
        className={classNames(
          'text-xl font-bold mt-5',
          PaymentMethodFormsStyles.flexElements,
        )}
      >
        Billing Address
      </p>
      <label className={PaymentMethodFormsStyles.flexElements}>
        <span className="mb-1 font-bold text-md">Street Address</span>
        <input
          className={PaymentMethodFormsStyles.billingInputs(
            errors.address1?.message,
          )}
          type="text"
          {...register('address1')}
        />

        <FormErrorText>{errors.address1?.message}</FormErrorText>
      </label>
      <label className={PaymentMethodFormsStyles.flexElements}>
        <span className="mb-1 font-bold text-md">Street Address Line 2</span>
        <input
          className={PaymentMethodFormsStyles.billingInputs(undefined)}
          type="text"
          {...register('address2')}
        />
      </label>
      <label className={PaymentMethodFormsStyles.nonFullWidthElements}>
        <span className="mb-1 font-bold text-md">City</span>
        <input
          className={PaymentMethodFormsStyles.billingInputs(
            errors.city?.message,
          )}
          type="text"
          {...register('city')}
        />

        <FormErrorText>{errors.city?.message}</FormErrorText>
      </label>
      <label className={PaymentMethodFormsStyles.nonFullWidthElements}>
        <span className="mb-1 font-bold text-md">State / Province</span>
        <input
          className={PaymentMethodFormsStyles.billingInputs(
            errors.state?.message,
          )}
          type="text"
          {...register('state')}
        />

        <FormErrorText>{errors.state?.message}</FormErrorText>
      </label>
      <label className={PaymentMethodFormsStyles.nonFullWidthElements}>
        <span className="mb-1 font-bold text-md">Postal / Zip Code</span>
        <input
          className={PaymentMethodFormsStyles.billingInputs(
            errors.postalCode?.message,
          )}
          type="text"
          {...register('postalCode')}
        />

        <FormErrorText>{errors.postalCode?.message}</FormErrorText>
      </label>
    </>
  );
};

export default BillingAddressForm;
