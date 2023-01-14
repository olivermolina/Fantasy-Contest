import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ContestCard } from './ContestCard';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/ContestCard',
  component: ContestCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ContestCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ContestCard> = (args) => (
  <ContestCard {...args} />
);

export const Locked = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Locked.args = {
  bgImageUrl: 'https://via.placeholder.com/150',
  startDateString: 'Mon May 15, 2022',
  endDateString: 'Mon May 15, 2022',
  contestName: 'contest test name',
  onClickCard: () => alert('Clicked card!'),
};

export const Active = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Active.args = {
  isActive: true,
  bgImageUrl: 'https://via.placeholder.com/150',
  startDateString: 'Mon May 15, 2022',
  endDateString: 'Mon May 15, 2022',
  contestName: 'contest test name',
  onClickCard: () => alert('Clicked card!'),
};
