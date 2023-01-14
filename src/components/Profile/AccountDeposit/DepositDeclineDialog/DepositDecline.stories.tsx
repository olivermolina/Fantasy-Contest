import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CardDepositDeclineComponent from './CreditCardDepositDecline';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Profile',
  component: CardDepositDeclineComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof CardDepositDeclineComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CardDepositDeclineComponent> = (args) => (
  <CardDepositDeclineComponent {...args} />
);

export const CreditCardDepositDecline = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
CreditCardDepositDecline.args = {};
