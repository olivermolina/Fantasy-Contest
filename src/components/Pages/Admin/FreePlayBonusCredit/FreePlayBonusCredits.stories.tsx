import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import FreePlayBonusCreditComponent from './FreePlayBonusCredit';
import { usersMock } from '~/components/Admin/Management/__mocks__/usersMocks';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Admin/Management/FreePlayBonusCredit',
  component: FreePlayBonusCreditComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof FreePlayBonusCreditComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FreePlayBonusCreditComponent> = (
  args,
) => <FreePlayBonusCreditComponent {...args} />;

export const FreePlayBonusCredit = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

FreePlayBonusCredit.args = {
  onSubmit: () => alert('test'),
  users: usersMock,
  isLoading: false,
};
