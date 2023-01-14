import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ContestPicker } from './ContestPicker';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/ContestPicker',
  component: ContestPicker,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ContestPicker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ContestPicker> = (args) => (
  <ContestPicker {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  contests: new Array(50).fill(1).map(() => ({
    bgImageUrl: 'https://via.placeholder.com/150',
    startDateString: 'Mon May 15, 2022',
    endDateString: 'Mon May 15, 2022',
    contestName: 'contest test name',
    onClickCard: () => alert('Clicked card!'),
  })),
};
