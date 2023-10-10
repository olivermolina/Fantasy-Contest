import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import BannerFormComponent from './BannerForm';
import { bannerMock } from './__mocks__/bannerMock';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/BannerForm',
  component: BannerFormComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof BannerFormComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BannerFormComponent> = (args) => (
  <BannerFormComponent {...args} />
);

export const EditBannerForm = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

EditBannerForm.args = {
  banner: bannerMock,
  appSettings: [],
};
