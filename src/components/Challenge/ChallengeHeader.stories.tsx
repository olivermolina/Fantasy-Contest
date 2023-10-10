import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ChallengeHeader from './ChallengeHeader';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Challenge',
  component: ChallengeHeader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ChallengeHeader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ChallengeHeader> = (args) => (
  <ChallengeHeader {...args} />
);

export const Header = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Header.args = {
  challengePromoMessage:
    'Pick 2-4 players. Predict if they will get MORE or LESS than their projection.',
  isLoading: false,
  handleOpenContactUs: () => {
    alert('Contact Us');
  },
};
