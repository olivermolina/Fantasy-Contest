import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import OfferFormComponent from './OfferForm';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin',
  component: OfferFormComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof OfferFormComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof OfferFormComponent> = (args) => (
  <OfferFormComponent {...args} />
);

export const Offer = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Offer.args = {
  handleClose: () => console.log('Close'),
  isLoading: false,
  mutationError: null,
  awayTeams: [
    {
      id: '1-nba',
      name: 'Atlanta Hawks',
      code: 'ATL',
    },
    {
      id: '2-nba',
      name: 'Boston Celtics',
      code: 'BOS',
    },
    {
      id: '3-nba',
      name: 'Cleveland Cavaliers',
      code: 'CLE',
    },
  ],
  homeTeams: [
    {
      id: '1-nba',
      name: 'Atlanta Hawks',
      code: 'ATL',
    },
    {
      id: '2-nba',
      name: 'Boston Celtics',
      code: 'BOS',
    },
    {
      id: '3-nba',
      name: 'Cleveland Cavaliers',
      code: 'CLE',
    },
  ],
};
