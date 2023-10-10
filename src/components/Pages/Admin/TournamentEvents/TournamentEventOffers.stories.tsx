import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TournamentEventOffers from './TournamentEventOffers';
import { tournamentEventOfferMock } from './__mocks__/tournamentEventOfferMock';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: TournamentEventOffers,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof TournamentEventOffers>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TournamentEventOffers> = (args) => (
  <TournamentEventOffers {...args} />
);

export const TournamentEventOffer = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
TournamentEventOffer.args = {
  ...tournamentEventOfferMock,
};
