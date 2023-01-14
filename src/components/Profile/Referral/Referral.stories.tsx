import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ReferralMenu from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Profile',
  component: ReferralMenu,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ReferralMenu>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ReferralMenu> = (args) => (
  <ReferralMenu {...args} />
);

export const Referral = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Referral.args = {
  referralCode: 'jsmith321',
};
