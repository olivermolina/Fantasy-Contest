import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ManageUserComponent from './ManageUserPermissions';
import { manageUserPermissionsMockProps } from './__mocks__/manageUserPermissionsMockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin',
  component: ManageUserComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ManageUserComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ManageUserComponent> = (args) => (
  <ManageUserComponent {...args} />
);

export const ManageUserPermissions = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ManageUserPermissions.args = manageUserPermissionsMockProps;
