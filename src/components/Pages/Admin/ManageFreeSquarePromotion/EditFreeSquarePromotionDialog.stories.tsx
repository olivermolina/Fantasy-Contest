import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EditFreeSquarePromotionDialog from './EditFreeSquarePromotionDialog';
import { mockEditProps } from './__mocks__/mockEditProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Manage/FreeSquarePromotion',
  component: EditFreeSquarePromotionDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof EditFreeSquarePromotionDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditFreeSquarePromotionDialog> = (
  args,
) => <EditFreeSquarePromotionDialog {...args} />;

export const EditFreeSquarePromotion = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
EditFreeSquarePromotion.args = mockEditProps;
