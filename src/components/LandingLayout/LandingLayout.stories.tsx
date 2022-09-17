import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import LandingLayout from '.';
import Content from '~/components/LandingLayout/Content';
import benDinnucciImage from '~/assets/ben-dinnucci.svg';
import tyrodTaylorImage from '~/assets/tyrod-taylor.svg';
import dallasGoedertImage from '~/assets/dallas-goedert.svg';
import prizesImage from '~/assets/prizes.svg';
import upDownImage from '~/assets/up-down-arrow.svg';
import contestTrophy from '~/assets/contest-trophy.svg';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/LandingLayout',
  component: LandingLayout,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    argTypes: {
      showHeaderActions: {
        options: [true, false],
        control: { type: 'radio' },
      },
    },
  },
} as ComponentMeta<typeof LandingLayout>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LandingLayout> = (args) => (
  <LandingLayout {...args} />
);

export const Main = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

const cards = [
  {
    onClickLess: () => console.log('clicked'),
    onClickMore: () => console.log('clicked'),
    stat: 'Passing Yards',
    value: 99.5,
    gameInfo: 'DAL @ DEN',
    playerName: 'Patrick Mahomes',
    image: benDinnucciImage,
  },
  {
    onClickLess: () => console.log('clicked'),
    onClickMore: () => console.log('clicked'),
    stat: 'Passing Yards',
    value: 112.5,
    gameInfo: 'NYG @ DEN',
    playerName: 'Tyrod Taylor',
    image: tyrodTaylorImage,
  },
  {
    onClickLess: () => console.log('clicked'),
    onClickMore: () => console.log('clicked'),
    stat: 'Passing Yards',
    value: 99.2,
    gameInfo: 'PE @ DEN',
    playerName: 'Dallas Goedert',
    image: dallasGoedertImage,
  },
];

const explainers = [
  {
    title: 'Win Cash Prizes!',
    description:
      'Play More or Less to try and win up to 10x your cash! Or play our Daily/Weekly Token contests with friends to try and climb the leaderboards for cash prizes.',
    image: prizesImage,
  },
  {
    title: 'More or Less',
    description:
      "Our More or Less game is exactly as it sounds. Pick 2-4 of your favorite player's as shown above and select if their stats will go Over or Under that amount to win 3x, 5x, or 10x your cash!",
    image: upDownImage,
  },
  {
    title: 'Token Contests',
    description:
      'Our Daily/Weekly Token contests gives every user 1000 tokens to start the contest. Place those 1000 tokens on any player\'s stats you want similar to"More or Less". Whoever ends up with the most tokens at the end wins cash depending on where they rank on our leaderboards.',
    image: contestTrophy,
  },
];
Main.args = {
  showHeaderActions: true,
  children: <Content cards={cards} explainers={explainers} />,
};
