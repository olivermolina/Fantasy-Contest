import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PendingBetsManagement } from './PendingBetsManagement';
import { mockProps } from './__mocks__/mockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: PendingBetsManagement,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof PendingBetsManagement>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PendingBetsManagement> = (args) => (
  <PendingBetsManagement {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = mockProps;
