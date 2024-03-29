import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Cart } from '.';
import {
  BetStakeType,
  ContestCategory,
  ContestWagerType,
  Prisma,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Cart',
  component: Cart,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Cart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Cart> = (args) => <Cart {...args} />;

export const Open = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
const contestCategories: ContestCategory[] = [
  {
    id: faker.datatype.uuid(),
    numberOfPicks: 2,
    allInPayoutMultiplier: 3,
    primaryInsuredPayoutMultiplier: 2,
    secondaryInsuredPayoutMultiplier: 0.5,
    customStakeLimitEnabled: false,
    maxStakeAmount: new Prisma.Decimal(0),
    minStakeAmount: new Prisma.Decimal(0),
    bonusCreditLimitId: null,
  },
  {
    id: faker.datatype.uuid(),
    numberOfPicks: 3,
    allInPayoutMultiplier: 5,
    primaryInsuredPayoutMultiplier: 2.5,
    secondaryInsuredPayoutMultiplier: 1.25,
    customStakeLimitEnabled: false,
    maxStakeAmount: new Prisma.Decimal(0),
    minStakeAmount: new Prisma.Decimal(0),
    bonusCreditLimitId: null,
  },
  {
    id: faker.datatype.uuid(),
    numberOfPicks: 4,
    allInPayoutMultiplier: 10,
    primaryInsuredPayoutMultiplier: 5,
    secondaryInsuredPayoutMultiplier: 1.25,
    customStakeLimitEnabled: false,
    maxStakeAmount: new Prisma.Decimal(0),
    minStakeAmount: new Prisma.Decimal(0),
    bonusCreditLimitId: null,
  },
];

Open.args = {
  activeTab: 'playerOU',
  onClickPlayerOU: () => alert('clicked onClickPlayerOU'),
  onClickTeamToken: () => alert('clicked onClickTeamToken'),
  links: [
    <a key={'dklj'}>Test</a>,
    <a key={'fdas'}>Test2</a>,
    <a key={'dfasj'}>Test3</a>,
  ],
  minimumEntryFee: 1,
  maximumEntryFee: 50,
  cartItems: [
    {
      id: '1',
      onUpdateCartItem: () => console.log('Updating cart item'),
      legs: [
        {
          id: '3423',
          league: 'NBA',
          matchTime: 'January 3rd, 2020',
          onClickDeleteCartItem: () => alert('clickedCartItem'),
          betName: 'Mount St. Marys',
          betOdds: 400,
          betType: 'Moneyline',
          awayTeamName: 'Florida State',
          homeTeamName: 'University of Florida',
          betOption: '',
          statName: '',
          onClickMoreLess: () => alert('onClickMoreLess'),
        },
      ],
      stake: '400',
      payout: '800',
      onUpdateBetStakeType: () => console.log('Updating stake type'),
      contestCategory: contestCategories[0]!,
      wagerType: ContestWagerType.TOKEN,
      stakeType: BetStakeType.ALL_IN,
      insuredPayout: {
        numberOfPicks: 2,
        primaryInsuredPayout: 0,
        secondaryInsuredPayout: 0,
        allInPayout: 0,
        allInPayoutMultiplier: 5,
        primaryInsuredPayoutMultiplier: 3,
        secondaryInsuredPayoutMultiplier: 2,
      },
    },
    {
      id: '1',
      onUpdateCartItem: () => console.log('Updating cart item'),
      legs: [
        {
          id: '3423',
          league: 'NBA',
          matchTime: 'January 3rd, 2020',
          onClickDeleteCartItem: () => alert('clickedCartItem'),
          betName: 'Mount St. Marys',
          betOdds: 400,
          betType: 'Moneyline',
          awayTeamName: 'Florida State',
          homeTeamName: 'University of Florida',
          betOption: '',
          statName: '',
          onClickMoreLess: () => alert('onClickMoreLess'),
        },
        {
          id: '3423',
          league: 'NBA',
          matchTime: 'January 3rd, 2020',
          onClickDeleteCartItem: () => alert('clickedCartItem'),
          betName: 'Mount St. Marys',
          betOdds: 400,
          betType: 'Moneyline',
          awayTeamName: 'Florida State',
          homeTeamName: 'University of Florida',
          betOption: '',
          statName: '',
          onClickMoreLess: () => alert('onClickMoreLess'),
        },
      ],
      stake: '400',
      payout: '800',
      onUpdateBetStakeType: () => console.log('Updating stake type'),
      contestCategory: contestCategories[0]!,
      wagerType: ContestWagerType.TOKEN,
      stakeType: BetStakeType.ALL_IN,
      insuredPayout: {
        numberOfPicks: 2,
        primaryInsuredPayout: 5,
        secondaryInsuredPayout: 2.5,
        allInPayout: 10,
        allInPayoutMultiplier: 5,
        primaryInsuredPayoutMultiplier: 3,
        secondaryInsuredPayoutMultiplier: 2,
      },
    },
  ],
  onClickSubmitForm: () => alert('submitting form'),
};

export const Loading = Template.bind({});

Loading.args = {
  ...Open.args,
  showLoading: true,
};
