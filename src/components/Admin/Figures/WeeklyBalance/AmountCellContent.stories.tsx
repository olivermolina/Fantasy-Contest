import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import AmountCellContent from './AmountCellContent';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Figures/WeeklyBalance',
  component: AmountCellContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AmountCellContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AmountCellContent> = (args) => (
  <AmountCellContent {...args} />
);

export const AmountCell = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

AmountCell.args = {
  amount: 100,
  onClick: () => alert('on click!'),
};
