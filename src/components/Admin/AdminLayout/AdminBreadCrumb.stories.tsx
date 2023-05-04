import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import AdminBreadCrumb from './AdminBreadCrumb';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin',
  component: AdminBreadCrumb,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AdminBreadCrumb>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AdminBreadCrumb> = () => (
  <AdminBreadCrumb />
);

export const BreadCrumb = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

BreadCrumb.args = {};
