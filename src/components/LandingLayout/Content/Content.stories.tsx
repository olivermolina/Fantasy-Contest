import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Main from './Content';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/LandingLayout',
  component: Main,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Main>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Main> = (args) => <Main {...args} />;

export const Content = Template.bind({});

Content.args = {
  cards: [
    {
      onClickLess: () => console.log('clicked'),
      onClickMore: () => console.log('clicked'),
      stat: 'Passing Yards',
      value: 99.5,
      gameInfo: 'DAL @ DEN',
      playerName: 'Patrick Mahomes',
      image: '/assets/images/patrick-mahomes.png',
      playerPosition: 'QB',
      playerTeam: 'KC',
    },
    {
      onClickLess: () => console.log('clicked'),
      onClickMore: () => console.log('clicked'),
      stat: 'Passing Yards',
      value: 112.5,
      gameInfo: 'NYG @ DEN',
      playerName: 'Tyrod Taylor',
      image: '/assets/images/tyrod-taylor.png',
      playerPosition: 'QB',
      playerTeam: 'KC',
    },
    {
      onClickLess: () => console.log('clicked'),
      onClickMore: () => console.log('clicked'),
      stat: 'Passing Yards',
      value: 99.2,
      gameInfo: 'PE @ DEN',
      playerName: 'Dallas Goedert',
      image: '/assets/images/dallas-goedert.png',
      playerPosition: 'QB',
      playerTeam: 'KC',
    },
  ],
  explainers: [
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
  ],
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Content.parameters = {
  backgrounds: { default: 'lockspread' },
};
