import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import SendSMS from './SendSMS';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: SendSMS,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof SendSMS>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SendSMS> = (args) => (
  <SendSMS {...args} />
);

export const ManageSendSMS = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ManageSendSMS.args = {
  onSubmit: () => console.log('submit'),
};
