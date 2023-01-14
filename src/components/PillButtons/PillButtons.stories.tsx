import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { PillButtons } from './PillButtons';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/PillButtons',
  component: PillButtons,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof PillButtons>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PillButtons> = (args) => (
  <PillButtons {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  pills: [
    {
      onClick: () => alert('clicked'),
      disabled: false,
      children: <>Pill1</>,
      selected: true,
      name: 'Pill1',
    },
    {
      onClick: () => alert('clicked'),
      disabled: false,
      children: <>Pill1</>,
      selected: false,
      name: 'Pill2',
    },
    {
      onClick: () => alert('clicked'),
      disabled: true,
      children: <>Pill1</>,
      selected: false,
      name: 'Pill1',
    },
  ],
};
