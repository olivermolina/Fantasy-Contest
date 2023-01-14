import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import PayoutAmountForm from './PayoutAmountForm';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: PayoutAmountForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof PayoutAmountForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PayoutAmountForm> = (args) => (
  <PayoutAmountForm {...args} />
);

export const Menu = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Menu.args = {
  setSelectedPayoutMethod: () => alert('test'),
  onSubmit: () => alert('test'),
  payoutAmount: 0,
  userTotalBalance: {
    totalAmount: 0,
    totalCashAmount: 0,
    creditAmount: 0,
    unPlayedAmount: 0,
    withdrawableAmount: 0,
  },
};
