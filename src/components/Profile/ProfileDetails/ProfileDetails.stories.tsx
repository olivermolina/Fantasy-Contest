import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import avatarImage from '~/assets/default-avatar.svg';

import ProfileDetails from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Profile',
  component: ProfileDetails,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ProfileDetails>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ProfileDetails> = (args) => (
  <ProfileDetails {...args} />
);

export const Details = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Details.args = {
  username: 'Nickten',
  image: avatarImage,
  followers: 502,
  following: 300,
};
