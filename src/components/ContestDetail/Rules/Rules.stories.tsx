import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { faker } from '@faker-js/faker';

import RulesContent from './Rules';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/ContestDetail',
  component: RulesContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof RulesContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RulesContent> = (args) => (
  <RulesContent {...args} />
);

export const Rules = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Rules.args = {
  content: (
    <div className={'flex flex-col gap-2'}>
      <p>{faker.lorem.paragraphs(5)}</p>
      <p>{faker.lorem.paragraphs(5)}</p>
      <p>{faker.lorem.paragraphs(5)}</p>
    </div>
  ),
};
