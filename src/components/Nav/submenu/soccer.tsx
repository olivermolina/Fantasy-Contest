import React from 'react';
import { SportsIconProps } from '~/components/Nav/leagues';

export function SoccerIcon(props: SportsIconProps) {
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
        id="g220"
        transform="matrix(0.140625,0,0,0.140625,3.5129741,4.6107784)"
        opacity={props.isSelected ? '1' : '0.4'}
      >
        <rect width="256" height="256" fill="none" id="rect2" x="0" y="0" />
        <circle
          cx="128"
          cy="128"
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="circle4"
          r="96"
        />
        <polygon
          points="152.7,162 167.9,115 128,86 88.1,115 103.3,162 "
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="polygon6"
        />
        <line
          x1="128"
          y1="64"
          x2="128"
          y2="86"
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="line8"
        />
        <polyline
          points="163 38.6 128 64 93 38.6"
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="polyline10"
        />
        <line
          x1="67.099998"
          y1="108.2"
          x2="88.099998"
          y2="115"
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="line12"
        />
        <polyline
          points="53.8 67.1 67.1 108.2 32.1 133.7"
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="polyline14"
        />
        <line
          x1="90.400002"
          y1="179.8"
          x2="103.3"
          y2="162"
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="line16"
        />
        <polyline
          points="47.1 179.8 90.4 179.8 103.8 220.9"
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="polyline18"
        />
        <line
          x1="165.60001"
          y1="179.8"
          x2="152.7"
          y2="162"
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="line20"
        />
        <polyline
          points="152.2 220.9 165.6 179.8 208.9 179.8"
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="polyline22"
        />
        <line
          x1="188.89999"
          y1="108.2"
          x2="167.89999"
          y2="115"
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="line24"
        />
        <polyline
          points="223.9 133.7 188.9 108.2 202.2 67.1"
          fill="none"
          stroke={props.isSelected ? '#003370' : '#fff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          id="polyline26"
        />
      </g>
    </svg>
  );
}
