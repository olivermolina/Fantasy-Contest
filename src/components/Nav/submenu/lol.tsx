import React from 'react';
import { SportsIconProps } from '~/components/Nav/leagues';

export function LoLIcon(props: SportsIconProps) {
  return (
    <svg width="44" height="44" fill="none" viewBox="0 0 44 44">
      <circle
        cx="22"
        cy="22"
        r="22"
        fill="#fff"
        opacity={props.isSelected ? '1' : '0.1'}
      ></circle>
      <svg
        viewBox="-10 -10 35 35"
        width="30px"
        height="30px"
        fill={props.isSelected ? '#003370' : '#fff'}
        opacity={props.isSelected ? '1' : '0.4'}
      >
        <path d="M 7 4 L 9 7.25 L 9 22.75 L 6.875 26 L 21.957031 26 L 25 22 L 14 22 L 14 4 L 7 4 z M 16 4.0507812 L 16 6.0585938 C 20.493 6.5575937 24 10.375 24 15 C 24 16.849 23.438516 18.569 22.478516 20 L 24.785156 20 C 25.556156 18.498 26 16.801 26 15 C 26 9.272 21.598 4.5577812 16 4.0507812 z M 6.8730469 7.6113281 C 5.0940469 9.5663281 4 12.155 4 15 C 4 17.837 5.0884219 20.418094 6.8574219 22.371094 L 7 22.154297 L 7 19.105469 C 6.365 17.872469 6 16.479 6 15 C 6 13.521 6.365 12.127531 7 10.894531 L 7 7.8164062 L 6.8730469 7.6113281 z" />
      </svg>
    </svg>
  );
}
