import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FantasyPicker } from './FantasyPicker';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/FantasyPicker',
  component: FantasyPicker,
} as ComponentMeta<typeof FantasyPicker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FantasyPicker> = (args) => (
  <FantasyPicker {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  filters: [
    {
      onClick: () => alert('clicked'),
      disabled: false,
      children: <>Pill1</>,
      selected: true,
    },
    {
      onClick: () => alert('clicked'),
      disabled: false,
      children: <>Pill1</>,
      selected: false,
    },
    {
      onClick: () => alert('clicked'),
      disabled: true,
      children: <>Pill1</>,
      selected: false,
    },
  ],
  cards: [
    {
      onClickLess: () => alert('clicked'),
      onClickMore: () => alert('clicked'),
      stat: 'Passing Yards',
      value: 99.5,
      gameInfo: 'LA@DEN',
      playerName: 'Patrick Mahomes',
      image: '/assets/images/dallas-goedert.png',
    },
    {
      onClickLess: () => alert('clicked'),
      onClickMore: () => alert('clicked'),
      stat: 'Passing Yards',
      value: 99.5,
      gameInfo: 'LA@DEN',
      playerName: 'Patrick Mahomes',
      image: '/assets/images/patrick-mahomes.png',
    },
    {
      onClickLess: () => alert('clicked'),
      onClickMore: () => alert('clicked'),
      stat: 'Passing Yards',
      value: 99.5,
      gameInfo: 'LA@DEN',
      playerName: 'Patrick Mahomes',
      image: '/assets/images/tyrod-taylor.png',
    },
    {
      onClickLess: () => alert('clicked'),
      onClickMore: () => alert('clicked'),
      stat: 'Passing Yards',
      value: 99.5,
      gameInfo: 'LA@DEN',
      playerName: 'Patrick Mahomes',
      image: '/assets/images/tyrod-taylor.png',
    },
  ],
};
