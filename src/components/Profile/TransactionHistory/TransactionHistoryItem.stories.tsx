import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import TransactionHistoryItem from './TransactionHistoryItem';
import { mockTransactions } from './__mocks__/mockTransactions';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: TransactionHistoryItem,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof TransactionHistoryItem>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TransactionHistoryItem> = (args) => (
  <TransactionHistoryItem {...args} />
);

export const Item = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Item.args = {
  row: mockTransactions[0],
};
