import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PendingPickDialog from './PendingPickDialog';
import { pendingPickDialogProps } from '~/components/Pages/Admin/PendingBetsManagement/__mocks__/pendingPickDialogMockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: PendingPickDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof PendingPickDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PendingPickDialog> = (args) => (
  <PendingPickDialog {...args} />
);

export const Dialog = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Dialog.args = pendingPickDialogProps;
