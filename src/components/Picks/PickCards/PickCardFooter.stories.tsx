import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PickCardFooter from './PickCardFooter';
import { PickStatus } from '~/constants/PickStatus';
import { BetStakeType } from '@prisma/client';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Picks',
  component: PickCardFooter,
} as ComponentMeta<typeof PickCardFooter>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PickCardFooter> = (args) => (
  <PickCardFooter {...args} />
);

export const CardFooter = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
CardFooter.args = {
  risk: 10,
  status: PickStatus.PENDING,
  potentialWin: 100,
  stakeType: BetStakeType.ALL_IN,
  payout: 100,
  bonusCreditStake: 10,
  isAdminView: true,
};
