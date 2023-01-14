import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Layout } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Layout',
  component: Layout,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Layout>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Layout> = (args) => <Layout {...args} />;

export const SidePane = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
SidePane.args = {
  userCashAmount: 100,
  currentContestTokenCount: 1000,
  children: <>test</>,
  onClickAddUserCash: () => alert('navigating to cash add page'),
  onClickCartDetails: () => alert('navigating to cart details'),
  cartItemsCount: 1,
  cartStake: 100,
  cartPotentialPayout: 1000,
};
