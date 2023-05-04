import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import LineExposureDetailsDialog from './LineExposureDetailsDialog';
import { lineExposureDetailsDialogMockProps } from '~/components/Pages/Admin/LineExposure/__mocks__/lineExposureDetailsDialogMockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Action',
  component: LineExposureDetailsDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof LineExposureDetailsDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LineExposureDetailsDialog> = (args) => (
  <LineExposureDetailsDialog {...args} />
);

export const ExposureDetailsDialog = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ExposureDetailsDialog.args = lineExposureDetailsDialogMockProps;
