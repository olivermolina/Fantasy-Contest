import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FantasyPicker } from './FantasyPicker';
import { mockCards } from '~/components/LandingLayout/__mocks__/mockCards';

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
      name: 'Pill1',
    },
    {
      onClick: () => alert('clicked'),
      disabled: false,
      children: <>Pill1</>,
      selected: false,
      name: 'Pill1',
    },
    {
      onClick: () => alert('clicked'),
      disabled: true,
      children: <>Pill1</>,
      selected: false,
      name: 'Pill1',
    },
  ],
  cards: mockCards,
};
