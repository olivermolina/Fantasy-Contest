import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { UserLimitsModal } from './UserLimitsModal';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: UserLimitsModal,
} as ComponentMeta<typeof UserLimitsModal>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserLimitsModal> = (args) => (
  <UserLimitsModal {...args} />
);

export const Open = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Open.args = {
  onSubmit: async (data) => {
    alert(data);
  },
  isOpen: true,
  isLoading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  onSubmit: async (data) => {
    alert(data);
  },
  isOpen: true,
  isLoading: true,
};
