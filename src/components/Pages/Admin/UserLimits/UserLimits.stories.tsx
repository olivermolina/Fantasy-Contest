import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { UserLimits as UserLimitsComponent } from './UserLimits';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin',
  component: UserLimitsComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof UserLimitsComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserLimitsComponent> = (args) => (
  <UserLimitsComponent {...args} />
);

export const UserLimits = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

UserLimits.args = {
  onSubmit(data) {
    console.log(data);
  },
};
