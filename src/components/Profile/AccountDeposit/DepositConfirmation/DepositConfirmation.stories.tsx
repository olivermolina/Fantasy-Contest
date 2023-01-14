import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Deposit from '.';

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

export const DepositConfirmation = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
DepositConfirmation.args = {
  depositAmount: 100,
};
