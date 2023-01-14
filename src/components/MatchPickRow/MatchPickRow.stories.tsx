import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { MatchPickRow } from './MatchPickRow';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/MatchPickRow',
  component: MatchPickRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof MatchPickRow>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MatchPickRow> = (args) => (
  <MatchPickRow {...args} />
);

const matchTime = '05 / 06 / 22, 04:00:00';
const showHeader = false;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  onClickOffer: (...params) => alert(params),
  away: {
    name: 'Mount St. Marys',
    spread: {
      disabled: true,
      odds: 5,
      value: 150,
    },
    total: {
      disabled: false,
      odds: 5,
      value: 150,
    },
    moneyline: {
      disabled: false,
      odds: 5,
      value: 150,
    },
  },
  home: {
    name: 'Mount St. Marys',
    spread: {
      disabled: true,
      odds: 5,
      value: 150,
    },
    total: {
      disabled: false,
      odds: 5,
      value: 150,
    },
    moneyline: {
      disabled: false,
      odds: 5,
      value: 150,
    },
  },
  matchTime,
  showHeader,
};
