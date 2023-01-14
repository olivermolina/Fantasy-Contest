import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Card from './ParlayCard';
import { PickStatus } from '~/constants/PickStatus';
import { BetLegType } from '@prisma/client';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Picks',
  component: Card,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Card>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const ParlayCard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

ParlayCard.args = {
  id: 232,
  name: 'Parlay Entry',
  gameInfo:
    'Golden State Warriors, Tampa Bay Lightning, Woverhampton Wanderers',
  contestType: 'Token Contest',
  pickTime: '12/06/2022',
  picks: [
    {
      id: 1,
      name: 'Golden State Warriors +17.5',
      description: 'Point Spread (including Overtime)',
      gameInfo: 'Golden State Warriors vs Dallas Mavericks',
      value: 140,
      matchTime: 'Sept 30, 2021 @ 7:30PM',
      odd: BetLegType.OVER_ODDS,
      status: PickStatus.PENDING,
    },
    {
      id: 2,
      name: 'Tampa Bay Lightning',
      description: '3-way moneyline (Regulation Time Only)',
      gameInfo: 'Florida Panthers vs TampaBay Lightning',
      value: 140,
      matchTime: 'Sept 30, 2021 @ 7:30PM',
      status: PickStatus.WIN,
      odd: BetLegType.UNDER_ODDS,
    },
    {
      id: 3,
      name: 'Woverhampton Wanderers',
      description: '3-way moneyline (Regulation Time Only)',
      gameInfo: 'Liverpool vs Woverhampton Wanderers',
      value: 1620,
      matchTime: 'Sept 30, 2021 @ 7:30PM',
      status: PickStatus.LOSS,
      odd: BetLegType.OVER_ODDS,
    },
    {
      id: 4,
      name: 'Woverhampton Wanderers',
      description: '3-way moneyline (Regulation Time Only)',
      gameInfo: 'Liverpool vs Woverhampton Wanderers',
      value: 1620,
      matchTime: 'Sept 30, 2021 @ 7:30PM',
      status: PickStatus.PUSH,
      odd: BetLegType.OVER_ODDS,
    },
  ],
  potentialWin: 27.56,
  risk: 13,
  status: PickStatus.CANCELLED,
};
