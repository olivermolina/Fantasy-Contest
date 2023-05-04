import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import WithdrawBonusCreditOffer from './WithdrawBonusCreditOffer';
import { mockWithdrawBonusCreditOfferProps } from './__mocks__/mockWithdrawBonusCreditOfferProps';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: WithdrawBonusCreditOffer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof WithdrawBonusCreditOffer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WithdrawBonusCreditOffer> = (args) => (
  <WithdrawBonusCreditOffer {...args} />
);

export const WithdrawBonusCreditOfferDialog = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithdrawBonusCreditOfferDialog.args = mockWithdrawBonusCreditOfferProps;
