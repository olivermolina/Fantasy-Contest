import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import UserAutocompleteComponent from './UserAutocomplete';
import { useForm } from 'react-hook-form';
import { ManagementInputs } from '~/components/Admin/Management/Management';
import { usersMock } from '~/components/Admin/Management/__mocks__/usersMocks';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/UserManagement',
  component: UserAutocompleteComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof UserAutocompleteComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserAutocompleteComponent> = (args) => {
  const { control } = useForm<ManagementInputs>();
  return <UserAutocompleteComponent {...args} control={control} />;
};

export const UserAutocomplete = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

UserAutocomplete.args = {
  users: usersMock,
  isLoading: false,
};
