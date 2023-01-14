import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { faker } from '@faker-js/faker';

import ContestDetailModalComponent from './ContestDetailModal';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/ContestDetail',
  component: ContestDetailModalComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ContestDetailModalComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ContestDetailModalComponent> = (args) => (
  <ContestDetailModalComponent {...args} />
);

export const ContestDetailModal = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

ContestDetailModal.args = {
  name: 'Contest Name',
  imgUrl: faker.image.avatar(),
  isModalOpen: true,
  overview: { content: faker.lorem.paragraph() },
  prizes: [
    {
      rank: 1,
      amount: 100,
    },
    {
      rank: 2,
      amount: 99,
    },
  ],
  rules: {
    content: faker.lorem.paragraph(),
  },
  entries: [
    {
      id: faker.random.alphaNumeric(),
      entryNumber: 1,
      name: 'Entry',
    },
  ],
};
