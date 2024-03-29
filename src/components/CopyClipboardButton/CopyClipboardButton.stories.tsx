import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CopyClipboardButton from './CopyClipboardButton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/CopyClipboardButton',
  component: CopyClipboardButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof CopyClipboardButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CopyClipboardButton> = (args) => (
  <CopyClipboardButton {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  text: 'Copy text',
};
