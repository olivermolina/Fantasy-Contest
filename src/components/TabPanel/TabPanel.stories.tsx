import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TabPanel } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/TabPanel',
  component: TabPanel,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof TabPanel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TabPanel> = (args) => (
  <TabPanel {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  tabs: [
    {
      tabId: 1,
      title: 'Tab 1',
    },
    {
      tabId: 2,
      title: 'Tab 2',
    },
    {
      tabId: 3,
      title: 'Tab 3',
    },
    {
      tabId: 4,
      title: 'Tab 4',
    },
  ],
  tabsContent: [
    {
      tabId: 1,
      content: 'Tab 1 Content',
    },
    {
      tabId: 2,
      content: 'Tab 2 Content',
    },
    {
      tabId: 3,
      content: 'Tab 3 Content',
    },
    {
      tabId: 4,
      content: 'Tab 4 Content',
    },
  ],
};
