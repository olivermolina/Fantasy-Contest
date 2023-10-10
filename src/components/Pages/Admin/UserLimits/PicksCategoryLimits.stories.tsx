import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { PicksCategoryLimits as PicksCategoryLimitsComponent } from './PicksCategoryLimits';
import { picksCategoryLimitMock } from './__mocks__/picksCategoryLimitMock';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin',
  component: PicksCategoryLimitsComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof PicksCategoryLimitsComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PicksCategoryLimitsComponent> = (
  args,
) => <PicksCategoryLimitsComponent {...args} />;

export const PicksCategoryLimits = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

PicksCategoryLimits.args = {
  onSubmit(data) {
    console.log(data);
  },
  defaultValues: picksCategoryLimitMock,
};
