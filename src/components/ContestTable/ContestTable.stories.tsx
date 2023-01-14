import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ContestTable } from './ContestTable';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/ContestTable',
  component: ContestTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ContestTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ContestTable> = (args) => (
  <ContestTable {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  contests: [
    {
      id: '100',
      name: 'Contest 1',
      onClickJoinContest: (...params) => alert(params),
      startDate: 'Mon Sept 06 2022 10:00pm',
      endDate: 'Mon Sept 06 2022 10:00pm',
      avatar: {
        imgSrc:
          'https://as2.ftcdn.net/v2/jpg/04/73/65/63/1000_F_473656322_63yWjOsNFidcGDp8rH6nVOYHhT8RoaDj.jpg',
        width: 200,
        height: 100,
        variant: 'rectangle',
      },
      showHeader: true,
      isJoined: true,
      entryFee: 50,
      totalPrize: 550,
      entries: 20,
      leaders: [
        {
          id: '1',
          name: 'leader 1',
          rank: 1,
          isMe: false,
          onClickYourself: () => alert('click me'),
        },
        {
          id: '2',
          name: 'leader 2',
          rank: 2,
          isMe: false,
          onClickYourself: () => alert('click me'),
        },
        {
          id: '3',
          name: 'leader 3',
          rank: 3,
          isMe: false,
          onClickYourself: () => alert('click me'),
        },
        {
          id: '4',
          name: 'leader 4',
          rank: 99,
          isMe: true,
          onClickYourself: () => alert('click me'),
        },
      ],
    },
    {
      id: '200',
      name: 'Contest 2',
      onClickJoinContest: (...params) => alert(params),
      startDate: 'Mon Sept 06 2022 10:00pm',
      endDate: 'Mon Sept 06 2022 10:00pm',
      entryFee: 50,
      totalPrize: 550,
      entries: 20,
      avatar: {
        imgSrc:
          'https://as2.ftcdn.net/v2/jpg/04/73/65/63/1000_F_473656322_63yWjOsNFidcGDp8rH6nVOYHhT8RoaDj.jpg',
        width: 200,
        height: 100,
        variant: 'rectangle',
      },
      showHeader: true,
      isJoined: false,
      leaders: [
        {
          id: '1',
          name: 'leader 1',
          rank: 1,
          isMe: false,
          onClickYourself: () => alert('click me'),
        },
        {
          id: '2',
          name: 'leader 2',
          rank: 2,
          isMe: false,
          onClickYourself: () => alert('click me'),
        },
        {
          id: '3',
          name: 'leader 3',
          rank: 3,
          isMe: false,
          onClickYourself: () => alert('click me'),
        },
      ],
    },
  ],
};
