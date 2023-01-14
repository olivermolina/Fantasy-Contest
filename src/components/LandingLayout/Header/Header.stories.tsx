import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import LandingHeader from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/LandingLayout',
  component: LandingHeader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    argTypes: {},
  },
} as ComponentMeta<typeof LandingHeader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LandingHeader> = () => (
  <div className="bg-wave-img text-white flex flex-col h-full">
    <LandingHeader />
  </div>
);

export const Header = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Header.args = {};
