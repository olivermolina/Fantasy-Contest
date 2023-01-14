import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AvatarCircle } from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/AvatarCircle',
  component: AvatarCircle,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AvatarCircle>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AvatarCircle> = (args) => (
  <AvatarCircle {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  imgSrc: 'https://via.placeholder.com/150',
  height: 150,
  width: 150,
};
