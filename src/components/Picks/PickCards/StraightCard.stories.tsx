import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Card from './StraightCard';
import { PickStatus } from '~/constants/PickStatus';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Picks',
  component: Card,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Card>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const StraightCard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

StraightCard.args = {
  id: 232,
  name: 'Straight Entry',
  description: 'New Your Rangers, Moneyline Away',
  gameInfo: 'New Yourk Rangers vs Tampa Bay Lightning ',
  contestType: 'More or Less',
  pickTime: '12/06/2022',
  potentialWin: 27.56,
  risk: 13,
  status: PickStatus.PENDING,
  value: 212,
};
