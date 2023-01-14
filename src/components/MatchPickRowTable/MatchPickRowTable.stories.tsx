import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { MatchPickRowTable } from './MatchPickRowTable';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/MatchPickRowTable',
  component: MatchPickRowTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof MatchPickRowTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MatchPickRowTable> = (args) => (
  <MatchPickRowTable {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  filters: [
    {
      selected: true,
      onClick: () => alert('test'),
      disabled: false,
      children: <>Val 1</>,
      name: 'Val 1',
    },
    {
      selected: false,
      onClick: () => alert('test'),
      disabled: false,
      children: <>Val 2</>,
      name: 'Val 2',
    },
    {
      selected: false,
      onClick: () => alert('test'),
      disabled: false,
      children: <>Val 3</>,
      name: 'Val 3',
    },
  ],
  matches: [
    {
      id: '100',
      onClickOffer: (...params) => alert(params),
      away: {
        name: 'Mount St. Marys',
        spread: {
          disabled: true,
          value: 100,
          odds: 100,
        },
        total: {
          disabled: false,
          value: 100,
          odds: 100,
        },
        moneyline: {
          disabled: false,
          value: 100,
          odds: 100,
        },
      },
      home: {
        name: 'Mount St. Marys',
        spread: {
          disabled: true,
          value: 100,
          odds: 100,
        },
        total: {
          disabled: false,
          value: 100,
          odds: 100,
        },
        moneyline: {
          disabled: false,
          value: 100,
          odds: 100,
        },
      },
      matchTime: '05 / 06 / 22, 04:00:00',
    },
    {
      id: '100',
      onClickOffer: (...params) => alert(params),
      away: {
        name: 'Mount St. Marys',
        spread: {
          disabled: true,
          value: 100,
          odds: 100,
        },
        total: {
          disabled: false,
          value: 100,
          odds: 100,
        },
        moneyline: {
          disabled: false,
          value: 100,
          odds: 100,
        },
      },
      home: {
        name: 'Mount St. Marys',
        spread: {
          disabled: true,
          value: 100,
          odds: 100,
        },
        total: {
          disabled: false,
          value: 100,
          odds: 100,
        },
        moneyline: {
          disabled: false,
          value: 100,
          odds: 100,
        },
      },
      matchTime: '05 / 06 / 22, 04:00:00',
    },
  ],
};
