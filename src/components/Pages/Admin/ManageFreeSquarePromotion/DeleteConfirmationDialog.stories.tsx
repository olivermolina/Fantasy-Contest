import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { mockDeleteProps } from './__mocks__/mockDeleteProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Manage/FreeSquarePromotion',
  component: DeleteConfirmationDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof DeleteConfirmationDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DeleteConfirmationDialog> = (args) => (
  <DeleteConfirmationDialog {...args} />
);

export const FreeSquareDeleteConfirmation = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
FreeSquareDeleteConfirmation.args = mockDeleteProps;
