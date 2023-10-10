import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EditFormComponent from './EditForm';
import { manageUserMocks, newUserMock } from './__mocks__/manageUserMocks';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/UserForm',
  component: EditFormComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof EditFormComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditFormComponent> = (args) => (
  <EditFormComponent {...args} />
);

export const EditPartnerForm = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

EditPartnerForm.args = {
  user: manageUserMocks[0],
  subAdminUsers: [],
};

export const AddPartnerForm = Template.bind({});

AddPartnerForm.args = {
  user: newUserMock,
  subAdminUsers: [],
};
