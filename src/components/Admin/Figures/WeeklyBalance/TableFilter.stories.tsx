import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TableFilter from './TableFilter';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Figures/WeeklyBalance',
  component: TableFilter,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof TableFilter>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TableFilter> = (args) => (
  <TableFilter {...args} />
);

export const WeeklyBalanceTableFilter = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

WeeklyBalanceTableFilter.args = {
  setDate: () => alert('set date'),
  globalFilter: '',
  setGlobalFilter: () => alert('set global filter'),
  viewInactive: false,
  setViewInactive: () => alert('view inactive'),
};
