import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import FreePlayUserBonusCreditsTable from './FreePlayUserBonusCreditsTable';
import { freePlayBonusCreditTableMockProps } from './__mocks__/freePlayBonusCreditTableMockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Management/FreePlayUserBonusCreditsTable',
  component: FreePlayUserBonusCreditsTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof FreePlayUserBonusCreditsTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FreePlayUserBonusCreditsTable> = (
  args,
) => <FreePlayUserBonusCreditsTable {...args} />;

export const FreePlayBonusCreditTable = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

FreePlayBonusCreditTable.args = freePlayBonusCreditTableMockProps;
