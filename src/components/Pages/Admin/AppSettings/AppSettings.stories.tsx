import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import AppSettingsComponent from './AppSettings';
import { appSettingsMockProps } from './__mocks__/appSettingsMockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/AppSettings',
  component: AppSettingsComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AppSettingsComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AppSettingsComponent> = (args) => (
  <AppSettingsComponent {...args} />
);

export const AppSettings = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

AppSettings.args = appSettingsMockProps;
