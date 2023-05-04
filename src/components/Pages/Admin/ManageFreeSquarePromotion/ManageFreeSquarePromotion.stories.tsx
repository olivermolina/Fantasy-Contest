import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import ManageFreeSquarePromotion from './ManageFreeSquarePromotion';
import { mockManageFreeSquarePromotionProps } from './__mocks__/mockManageFreeSquarePromotionProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Manage/FreeSquarePromotion',
  component: ManageFreeSquarePromotion,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ManageFreeSquarePromotion>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ManageFreeSquarePromotion> = (args) => (
  <ManageFreeSquarePromotion {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = mockManageFreeSquarePromotionProps;
