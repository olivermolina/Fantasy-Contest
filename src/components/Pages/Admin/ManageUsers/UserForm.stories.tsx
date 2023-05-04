import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import UserFormComponent from './UserForm';
import {
  manageUserMocks,
  newUserMock,
  subAdminUsersMock,
} from './__mocks__/manageUserMocks';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/UserForm',
  component: UserFormComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof UserFormComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserFormComponent> = (args) => (
  <UserFormComponent {...args} />
);

export const EditUserForm = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

EditUserForm.args = {
  user: manageUserMocks[0],
  subAdminUsers: subAdminUsersMock,
};

export const AddUserForm = Template.bind({});

AddUserForm.args = {
  user: newUserMock,
  subAdminUsers: subAdminUsersMock,
};
