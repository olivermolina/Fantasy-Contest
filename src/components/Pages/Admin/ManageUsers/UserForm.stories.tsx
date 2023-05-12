import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import UserFormComponent from './UserForm';
import { userMock } from './__mocks__/userMock';

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
  user: userMock,
};

export const AddUserForm = Template.bind({});

AddUserForm.args = {
  user: userMock,
};
