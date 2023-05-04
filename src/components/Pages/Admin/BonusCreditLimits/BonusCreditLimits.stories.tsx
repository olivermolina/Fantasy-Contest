import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import BonusCreditLimits from './BonusCreditLimits';
import { bonusCreditLimitMockProps } from '~/components/Pages/Admin/BonusCreditLimits/__mocks__/bonusCreditLimitMockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Management/BonusCreditLimits',
  component: BonusCreditLimits,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof BonusCreditLimits>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BonusCreditLimits> = (args) => (
  <BonusCreditLimits {...args} />
);

export const BonusCreditLimit = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

BonusCreditLimit.args = bonusCreditLimitMockProps;
