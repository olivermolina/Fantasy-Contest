import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ACHFormComponent from './ACHForm';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

export default {
  title: 'Lockspread/Profile',
  component: ACHFormComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ACHFormComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ACHFormComponent> = (args) => (
  <ACHFormComponent {...args} />
);

export const ACHForm = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ACHForm.args = {};
