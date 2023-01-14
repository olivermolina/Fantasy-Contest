import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LeaderBoardTable } from './LeaderBoardTable';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/LeaderBoardTable',
  component: LeaderBoardTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof LeaderBoardTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LeaderBoardTable> = (args) => (
  <LeaderBoardTable {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  contests: [
    {
      selected: true,
      onClick: () => {
        alert('click');
      },
      // no returned filters should be disabled
      disabled: false,
      children: <span className="capitalize text-xs">Contest 1</span>,
      name: 'Pill1',
    },
    {
      selected: true,
      onClick: () => {
        alert('click');
      },
      // no returned filters should be disabled
      disabled: false,
      children: <span className="capitalize text-xs">Contest 2</span>,
      name: 'Pill1',
    },
    {
      selected: true,
      onClick: () => {
        alert('click');
      },
      // no returned filters should be disabled
      disabled: false,
      children: <span className="capitalize text-xs">Contest 3</span>,
      name: 'Pill1',
    },
  ],
  leaders: [
    {
      id: '1',
      avatar: {
        imgSrc:
          'https://as2.ftcdn.net/v2/jpg/04/73/65/63/1000_F_473656322_63yWjOsNFidcGDp8rH6nVOYHhT8RoaDj.jpg',
        height: 30,
        width: 30,
      },
      isTopRanked: false,
      name: 'Leader 33',
      points: 25,
      rank: 2,
      showHeader: true,
    },
    {
      id: '2',
      avatar: {
        imgSrc:
          'https://as2.ftcdn.net/v2/jpg/04/73/65/63/1000_F_473656322_63yWjOsNFidcGDp8rH6nVOYHhT8RoaDj.jpg',
        height: 30,
        width: 30,
      },
      isTopRanked: false,
      name: 'Leader 44',
      points: 20,
      rank: 3,
      showHeader: true,
    },
    {
      id: '5',
      avatar: {
        imgSrc:
          'https://as2.ftcdn.net/v2/jpg/04/73/65/63/1000_F_473656322_63yWjOsNFidcGDp8rH6nVOYHhT8RoaDj.jpg',
        height: 30,
        width: 30,
      },
      isTopRanked: true,
      name: 'Leader 1',
      points: 30,
      rank: 1,
      showHeader: true,
    },
    {
      id: '1',
      avatar: {
        imgSrc:
          'https://as2.ftcdn.net/v2/jpg/04/73/65/63/1000_F_473656322_63yWjOsNFidcGDp8rH6nVOYHhT8RoaDj.jpg',
        height: 30,
        width: 30,
      },
      isTopRanked: true,
      name: 'Leader 1',
      points: 30,
      rank: 1,
      showHeader: true,
    },
  ],
};
