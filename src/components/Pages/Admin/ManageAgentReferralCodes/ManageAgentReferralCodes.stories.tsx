import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ManageAgentReferralCodes from './ManageAgentReferralCodes';
import { manageAgentReferralCodesMockProps } from '~/components/Pages/Admin/ManageAgentReferralCodes/__mocks__/manageAgentReferralCodesMockProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Management/AgentReferralCodes',
  component: ManageAgentReferralCodes,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ManageAgentReferralCodes>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ManageAgentReferralCodes> = (args) => (
  <ManageAgentReferralCodes {...args} />
);

export const Default = Template.bind({});
Default.args = manageAgentReferralCodesMockProps;

export const WithLoading = Template.bind({});
WithLoading.args = {
  ...manageAgentReferralCodesMockProps,
  isLoading: true,
};
