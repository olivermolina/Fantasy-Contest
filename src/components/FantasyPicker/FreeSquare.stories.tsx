import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import FreeSquare from './FreeSquare';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/FantasyPicker',
  component: FreeSquare,
} as ComponentMeta<typeof FreeSquare>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FreeSquare> = (args) => (
  <FreeSquare {...args} />
);

export const FreeSquarePromo = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
FreeSquarePromo.args = {
  gameDateTime: '2023-03-25 8:00 PM',
  discount: 95,
};
