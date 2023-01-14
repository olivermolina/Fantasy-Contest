import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { WarningAlert } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Alerts',
  component: WarningAlert,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof WarningAlert>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WarningAlert> = (args) => (
  <WarningAlert {...args} />
);

export const Warning = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Warning.args = {
  children: (
    <>
      <span className="font-medium">Warning alert!</span> Change a few things up
      and try submitting again.
    </>
  ),
};
