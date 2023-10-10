import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import LeagueLimitsComponent from './LeagueLimits';
import { leagueLimitsMock } from './__mocks__/leagueLimitMock';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/UserLimits/LeagueLimits',
  component: LeagueLimitsComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof LeagueLimitsComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LeagueLimitsComponent> = (args) => (
  <LeagueLimitsComponent {...args} />
);

export const LeagueLimits = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

LeagueLimits.args = {
  onSubmit(data) {
    console.log(data);
  },
  leagueLimits: leagueLimitsMock,
};
