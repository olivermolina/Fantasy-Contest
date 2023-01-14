import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import PrizesContent from './Prizes';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/ContestDetail',
  component: PrizesContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof PrizesContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrizesContent> = (args) => (
  <PrizesContent {...args} />
);

export const Prizes = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Prizes.args = {
  prizes: [
    {
      rank: 1,
      amount: 1000,
    },
    {
      rank: 2,
      amount: 500,
    },
    {
      rank: 3,
      amount: 100,
    },
  ],
};
