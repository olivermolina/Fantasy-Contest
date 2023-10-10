import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ManageBannersComponent from './ManageBanners';
import { manageBannerMock } from './__mocks__/manageBannerMock';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin',
  component: ManageBannersComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ManageBannersComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ManageBannersComponent> = (args) => (
  <ManageBannersComponent {...args} />
);

export const ManageBanners = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

ManageBanners.args = manageBannerMock;
