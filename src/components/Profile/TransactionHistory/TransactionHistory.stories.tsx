import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import TransactionHistory from './TransactionHistory';
import { mockTransactions } from './__mocks__/mockTransactions';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: TransactionHistory,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof TransactionHistory>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TransactionHistory> = (args) => (
  <TransactionHistory {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  transactions: mockTransactions,
  isLoading: false,
};
