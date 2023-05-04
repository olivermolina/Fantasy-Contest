import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import WithdrawalOffer from './ManageWithdrawalOffer';
import { mockManageWithdrawalProps } from './__mocks__/mockManageWithdrawalProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Management/FreePlayBonusCredit',
  component: WithdrawalOffer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof WithdrawalOffer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WithdrawalOffer> = (args) => (
  <WithdrawalOffer {...args} />
);

export const ManageWithdrawalOffer = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

ManageWithdrawalOffer.args = mockManageWithdrawalProps;
