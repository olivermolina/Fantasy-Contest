import React from 'react';
import { faker } from '@faker-js/faker';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ContestPickerCategory from './ContestPickerCategory';
import { Prisma } from '@prisma/client';

export default {
  title: 'Lockspread/ContestPickerCategory',
  component: ContestPickerCategory,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ContestPickerCategory>;

const Template: ComponentStory<typeof ContestPickerCategory> = (args) => (
  <ContestPickerCategory {...args} />
);

export const Default = Template.bind({});
Default.args = {
  category: {
    id: faker.datatype.uuid(),
    numberOfPicks: 2,
    allInPayoutMultiplier: 3,
    primaryInsuredPayoutMultiplier: 2,
    secondaryInsuredPayoutMultiplier: 0.5,
    customStakeLimitEnabled: false,
    maxStakeAmount: new Prisma.Decimal(0),
    minStakeAmount: new Prisma.Decimal(0),
    bonusCreditLimitId: '',
  },
  isSelected: false,
};

export const Selected = Template.bind({});
Selected.args = {
  category: {
    id: faker.datatype.uuid(),
    numberOfPicks: 3,
    allInPayoutMultiplier: 5,
    primaryInsuredPayoutMultiplier: 2.5,
    secondaryInsuredPayoutMultiplier: 1.25,
    customStakeLimitEnabled: false,
    maxStakeAmount: new Prisma.Decimal(0),
    minStakeAmount: new Prisma.Decimal(0),
    bonusCreditLimitId: '',
  },
  isSelected: true,
};
