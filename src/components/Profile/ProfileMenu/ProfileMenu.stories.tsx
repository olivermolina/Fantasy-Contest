import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import ProfileMenu from '.';
import Icons from '~/components/Icons';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Profile',
  component: ProfileMenu,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ProfileMenu>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ProfileMenu> = (args) => (
  <ProfileMenu {...args} />
);

export const Menu = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Menu.args = {
  menus: [
    {
      key: 'account-deposit',
      label: 'Account Deposit',
      icon: <Icons.CurrencyDollar className={'h-6 w-6'} />,
    },
    {
      key: 'profile-details',
      label: 'Profile Details',
      icon: <Icons.User className={'h-6 w-6'} />,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Icons.Settings className={'h-6 w-6'} />,
    },
    {
      key: 'verify-your-profile',
      label: 'Verify Your Profile',
      icon: <Icons.UserCheck className={'h-6 w-6'} />,
    },
    {
      key: 'referral',
      label: 'Referral',
      icon: <Icons.UserAdd className={'h-6 w-6'} />,
    },
    {
      key: 'logout',
      label: 'Log Out',
    },
  ],
  onSelectCallback: (menu) => alert(`You clicked the ${menu.key}`),
};
