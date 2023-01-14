import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { faker } from '@faker-js/faker';

import OverviewContent from './Overview';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/ContestDetail',
  component: OverviewContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof OverviewContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof OverviewContent> = (args) => (
  <OverviewContent {...args} />
);

export const Overview = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Overview.args = {
  content: (
    <div>
      <img
        className={'float-left mr-2'}
        alt={''}
        src={faker.image.sports()}
        width="150"
        height="150"
      />
      <p className={'my-2'}>{faker.lorem.paragraphs(10)}</p>
      <p className={'my-2'}>{faker.lorem.paragraphs(5)}</p>
    </div>
  ),
};
