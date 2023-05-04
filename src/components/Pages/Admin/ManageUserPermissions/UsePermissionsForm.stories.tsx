import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import UserPermissionFormComponent from './UserPermissionsForm';
import { userPermissionsFormMockProps } from './__mocks__/userPermissionsFormMockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin',
  component: UserPermissionFormComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof UserPermissionFormComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserPermissionFormComponent> = (args) => (
  <UserPermissionFormComponent {...args} />
);

export const UserPermissionForm = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
UserPermissionForm.args = userPermissionsFormMockProps;
