import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Deposit from '.';
import { CardTypes } from '~/constants/CardTypes';
import visa from '~/assets/visa-dark.svg';
import mastercard from '~/assets/mastercard.svg';
import amex from '~/assets/amex.svg';
import discover from '~/assets/discover.svg';
import paypal from '~/assets/paypal.svg';
import ach from '~/assets/ach.svg';
import { PaymentMethodType } from '@prisma/client';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Profile',
  component: Deposit,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
    isFirstDeposit: {
      options: [true, false],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Deposit>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Deposit> = (args) => (
  <Deposit {...args} />
);

export const DepositMethod = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
DepositMethod.args = {
  onPaymentSelect: () => {
    alert('onPaymentSelect');
  },

  depositAmount: 100,
  handleNext: () => {
    alert('handleNext');
  },
  handleBack: () => {
    alert('handleBack');
  },
  paymentMethods: [
    {
      key: CardTypes.visa,
      image: visa,
      type: PaymentMethodType.CC,
    },
    {
      key: CardTypes.mastercard,
      image: mastercard,
      type: PaymentMethodType.CC,
    },
    {
      key: CardTypes.amex,
      image: amex,
      type: PaymentMethodType.CC,
    },
    {
      key: CardTypes.discover,
      image: discover,
      type: PaymentMethodType.CC,
    },
    {
      key: 'paypal',
      image: paypal,
      type: PaymentMethodType.Paypal,
    },
    {
      key: 'ach',
      image: ach,
      type: PaymentMethodType.ACH,
    },
  ],
};
