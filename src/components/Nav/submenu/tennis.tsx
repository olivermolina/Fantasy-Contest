import React from 'react';
import { SportsIconProps } from '~/components/Nav/leagues';

export function TennisIcon(props: SportsIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      fill="none"
      viewBox="0 0 44 44"
    >
      <g fill="#fff" clipPath="url(#clip0_1_6)">
        <circle
          cx="22"
          cy="22"
          r="22"
          opacity={props.isSelected ? '1' : '0.1'}
        ></circle>
        <path
          d="M31.9 12.1A13.908 13.908 0 0022 8c-3.74 0-7.255 1.456-9.9 4.1A13.908 13.908 0 008 22c0 3.74 1.456 7.255 4.1 9.9A13.908 13.908 0 0022 36c3.74 0 7.255-1.456 9.9-4.1A13.909 13.909 0 0036 22c0-3.74-1.456-7.255-4.1-9.9zM8.86 22c0-2.837.893-5.536 2.546-7.777A8.31 8.31 0 0116.755 22a8.309 8.309 0 01-5.35 7.777A13.042 13.042 0 018.86 22zm22.431 9.291A13.054 13.054 0 0122 35.14c-3.51 0-6.81-1.367-9.291-3.849a13.4 13.4 0 01-.746-.81A9.167 9.167 0 0017.615 22a9.168 9.168 0 00-5.652-8.48c.236-.28.484-.55.746-.811a13.054 13.054 0 019.29-3.849c3.51 0 6.81 1.367 9.292 3.849.261.26.51.532.746.81A9.167 9.167 0 0026.385 22a9.167 9.167 0 005.652 8.482 13.4 13.4 0 01-.746.81zM27.245 22a8.309 8.309 0 015.35-7.777A13.042 13.042 0 0135.14 22c0 2.837-.893 5.536-2.546 7.777A8.309 8.309 0 0127.245 22z"
          opacity={props.isSelected ? '1' : '0.4'}
          fill={props.isSelected ? '#003370' : '#fff'}
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_1_6">
          <path fill="#fff" d="M0 0H44V44H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}
