import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { faker } from '@faker-js/faker';

import EntriesContent from './Entries';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/ContestDetail',
  component: EntriesContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof EntriesContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EntriesContent> = (args) => (
  <EntriesContent {...args} />
);

export const Entries = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Entries.args = {
  entries: [
    ...Array(10)
      .fill(0)
      .map((x, rank) => ({
        id: faker.datatype.uuid(),
        entryNumber: rank + 1,
        name: faker.name.fullName(),
      })),
  ],
};
