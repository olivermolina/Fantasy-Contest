import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import LineExposure from './LineExposure';
import { lineExposureMockProps } from './__mocks__/lineExposureMockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Action',
  component: LineExposure,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof LineExposure>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LineExposure> = (args) => (
  <LineExposure {...args} />
);

export const Exposure = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Exposure.args = lineExposureMockProps;
