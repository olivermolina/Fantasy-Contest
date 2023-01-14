import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LeaderBoardRow } from './LeaderBoardRow';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/LeaderBoardRow',
  component: LeaderBoardRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof LeaderBoardRow>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LeaderBoardRow> = (args) => (
  <LeaderBoardRow {...args} />
);
export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  id: '1',
  name: 'Mega Contest',
  avatar: {
    imgSrc:
      'https://as2.ftcdn.net/v2/jpg/04/73/65/63/1000_F_473656322_63yWjOsNFidcGDp8rH6nVOYHhT8RoaDj.jpg',
    width: 30,
    height: 30,
  },
  points: 500,
  rank: 1,
  isTopRanked: true,
  showHeader: true,
};
