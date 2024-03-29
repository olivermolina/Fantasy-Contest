import React from 'react';
import { SportsIconProps } from '~/components/Nav/leagues';

export function GolfIcon(props: SportsIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      fill="none"
      viewBox="0 0 44 44"
    >
      <circle
        cx="22"
        cy="22"
        r="22"
        fill="#fff"
        opacity={props.isSelected ? '1' : '0.1'}
      ></circle>
      <g
        fill={props.isSelected ? '#003370' : '#fff'}
        opacity={props.isSelected ? '1' : '0.4'}
      >
        <path d="M24.77 25.783a.55.55 0 00-.572.502.539.539 0 00.502.573c6.4.422 10.223 2.203 10.223 3.68 0 1.783-5.307 3.77-12.923 3.77S9.077 32.32 9.077 30.538c0-1.497 4.06-3.339 10.622-3.705a.538.538 0 10-.06-1.075C13.847 26.081 8 27.685 8 30.538c0 3.148 7.213 4.847 14 4.847s14-1.699 14-4.847c0-2.772-5.64-4.386-11.23-4.755zM28.209 12.313L23.9 9.62a.539.539 0 00-.571.913l3.577 2.236-3.577 2.236a.539.539 0 00.571.913l4.308-2.692a.539.539 0 000-.913z"></path>
        <path d="M23.143 30.035h-.664V9.538a.538.538 0 10-1.077 0v20.497h-.479a.538.538 0 100 1.077h2.22a.538.538 0 100-1.077z"></path>
      </g>
    </svg>
  );
}
