import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Reward from '.';
import { mockBanner } from './__mocks__/mockBanner';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/RewardCard',
  component: Reward,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
    isFirstRewardCard: {
      options: [true, false],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Reward>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Reward> = (args) => <Reward {...args} />;

export const RewardCard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
RewardCard.args = {
  banner: mockBanner,
};
