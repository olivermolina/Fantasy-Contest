import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import BalanceTableByAgentComponent from './BalanceTableByAgent';
import { weeklyBalanceMockData } from './__mocks__/weeklyBalanceMockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Figures/WeeklyBalance',
  component: BalanceTableByAgentComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof BalanceTableByAgentComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BalanceTableByAgentComponent> = (
  args,
) => <BalanceTableByAgentComponent {...args} />;

export const BalanceTableByAgent = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

BalanceTableByAgent.args = {
  agent: { id: '1', userId: '2', subAdminId: '' },
  data: weeklyBalanceMockData,
  dateRange: {
    from: '2023-01-01',
    to: '2023-01-01',
  },
};
