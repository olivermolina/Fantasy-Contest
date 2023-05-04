import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import LandingLayout from '.';
import Content from '~/components/LandingLayout/Content';
import { mockCards } from './__mocks__/mockCards';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/LandingLayout',
  component: LandingLayout,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof LandingLayout>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LandingLayout> = (args) => (
  <LandingLayout {...args} />
);

export const Main = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

const explainers = [
  {
    title: 'Win Cash Prizes!',
    description:
      'Play More or Less to try and win up to 10x your cash! Or play our Daily/Weekly Token contests with friends to try and climb the leaderboards for cash prizes.',
    image: '/assets/images/prizes.svg',
  },
  {
    title: 'More or Less',
    description:
      "Our More or Less contest is exactly as it sounds. Pick 2-4 of your favorite player's as shown above and select if their stats will go Over or Under that amount to win 3x, 5x, or 10x your cash!",
    image: '/assets/images/up-down-arrow.svg',
  },
  {
    title: 'Token Contests',
    description:
      'Our Daily/Weekly Token contests gives every user 1000 tokens to start the contest. Place those 1000 tokens on any player\'s stats you want similar to"More or Less". Whoever ends up with the most tokens at the end wins cash depending on where they rank on our leaderboards.',
    image: '/assets/images/contest-trophy.svg',
  },
];
Main.args = {
  children: (
    <Content
      cards={mockCards}
      explainers={explainers}
      banners={[
        {
          id: 'default',
          text: 'LockSpread will match your first deposit up to $50!',
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]}
      isLoading={false}
    />
  ),
};
