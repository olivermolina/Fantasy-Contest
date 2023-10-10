import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import AddRemoveWithdrawableComponent from './ManageAmountAvailableToWithdraw';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/UserManagement',
  component: AddRemoveWithdrawableComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AddRemoveWithdrawableComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddRemoveWithdrawableComponent> = (
  args,
) => <AddRemoveWithdrawableComponent {...args} />;

export const AddRemoveWithdrawable = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

AddRemoveWithdrawable.args = {
  users: [],
  isLoading: false,
  saveUserWallet: () => () => alert('test'),
};
