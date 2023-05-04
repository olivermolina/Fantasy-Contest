import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import AdminLayout from './AdminLayout';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin',
  component: AdminLayout,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AdminLayout>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AdminLayout> = (args) => (
  <AdminLayout {...args} />
);

export const Layout = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Layout.args = {};
