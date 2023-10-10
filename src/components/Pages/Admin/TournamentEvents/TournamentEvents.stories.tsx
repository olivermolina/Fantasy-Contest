import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TournamentEvents from './TournamentEvents';
import { tournamentEventMock } from './__mocks__/tournamentEventMock';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: TournamentEvents,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof TournamentEvents>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TournamentEvents> = (args) => (
  <TournamentEvents {...args} />
);

export const TournamentEvent = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
TournamentEvent.args = {
  ...tournamentEventMock,
};
