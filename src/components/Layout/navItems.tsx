import React from 'react';
import classNames from 'classnames';
import { ChallengeIcon } from '../Nav/Icons/challenge';
import { UserIcon } from '../Nav/Icons/user';

const iconClasses =
  'object-contain h-auto max-w-full m-auto mb-1.5 stroke-current';
export const navItems = [
  {
    link: '/challenge',
    name: 'Challenge',
    icon: <ChallengeIcon className={classNames('h-7 m-auto', iconClasses)} />,
  },
  {
    link: '/picks',
    anchor: true,
    name: 'Picks',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={classNames('h-7 m-auto', iconClasses)}
        fill="none"
        viewBox="0 0 22 22"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    link: '/contests',
    name: 'Contests',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={classNames('h-7 m-auto', iconClasses)}
        fill="none"
        viewBox="0 0 22 22"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
        />
      </svg>
    ),
  },
  {
    link: '/profile',
    name: 'Profile',
    icon: <UserIcon className={classNames('h-7 m-auto', iconClasses)} />,
  },
];
