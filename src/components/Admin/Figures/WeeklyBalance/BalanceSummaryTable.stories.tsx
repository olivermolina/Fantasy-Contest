import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import BalanceSummaryTableComponent from './BalanceSummaryTable';
import { weeklyBalanceMockData } from './__mocks__/weeklyBalanceMockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Figures/WeeklyBalance',
  component: BalanceSummaryTableComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof BalanceSummaryTableComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BalanceSummaryTableComponent> = (
  args,
) => <BalanceSummaryTableComponent {...args} />;

export const BalanceSummaryTable = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

BalanceSummaryTable.args = {
  data: weeklyBalanceMockData,
  viewInactive: false,
  activeCount: 0,
  inactiveCount: 0,
};
