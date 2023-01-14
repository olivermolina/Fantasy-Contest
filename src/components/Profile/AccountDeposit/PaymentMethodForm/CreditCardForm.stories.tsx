import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CreditCardFormStory from './CreditCardForm';
import visa from '~/assets/visa-dark.svg';
import mastercard from '~/assets/mastercard.svg';
import amex from '~/assets/amex.svg';
import discover from '~/assets/discover.svg';
import { CardTypes } from '~/constants/CardTypes';
import { PaymentMethodType } from '@prisma/client';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const paymentMethods = {
  visa: {
    key: CardTypes.visa,
    image: visa,
    object: 'object-fit',
  },
  mastercard: {
    key: CardTypes.mastercard,
    image: mastercard,
    object: 'object-cover',
  },
  amex: {
    key: CardTypes.amex,
    image: amex,
    object: 'object-fit',
  },
  discover: {
    key: CardTypes.visa,
    image: discover,
    object: 'object-fit',
  },
};

export default {
  title: 'Lockspread/Profile',
  component: CreditCardFormStory,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    paymentMethod: {
      control: {
        type: 'select',
        labels: {
          // 'labels' maps option values to string labels
          visa: 'Visa',
          mastercard: 'Mastercard',
          amex: 'Amex',
          discover: 'Discover',
        },
      },
      options: Object.keys(paymentMethods),
      mapping: paymentMethods,
    },
  },
} as ComponentMeta<typeof CreditCardFormStory>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CreditCardFormStory> = (args) => (
  <CreditCardFormStory {...args} />
);

export const CreditCardForm = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
CreditCardForm.args = {
  paymentMethod: {
    key: 'visa',
    image: visa,
    type: PaymentMethodType.CC,
  },
  handleChangePaymentMethod: () => {
    console.log('handleChangePaymentMethod');
  },
};
