import React from 'react';
import { FootballIcon } from './submenu/football';
import { BasketballIcon } from './submenu/basketball';
import { BaseballIcon } from './submenu/baseball';
import { TrophyIcon } from './submenu/trophy';
import { TennisIcon } from './submenu/tennis';
import { BoxingIcon } from './submenu/boxing';
import { GolfIcon } from './submenu/golf';
import { SoccerIcon } from './submenu/soccer';
import { UrlPaths } from '~/constants/UrlPaths';

export interface SportsIconProps {
  isSelected?: boolean;
}

const leagues = {
  NFL: {
    link: UrlPaths.Challenge + '?league=nfl',
    Icon: (props: any) => <FootballIcon {...props} />,
  },
  NBA: {
    link: UrlPaths.Challenge + '?league=nba',
    Icon: (props: any) => <BasketballIcon {...props} />,
  },
  NCAAB: {
    link: UrlPaths.Challenge + '?league=ncaab',
    Icon: (props: any) => <BasketballIcon {...props} />,
  },
  MLB: {
    link: UrlPaths.Challenge + '?league=mlb',
    Icon: (props: any) => <BaseballIcon {...props} />,
  },
  NHL: {
    link: UrlPaths.Challenge + '?league=nhl',
    Icon: (props: any) => <TrophyIcon {...props} />,
  },
  NCAAF: {
    link: UrlPaths.Challenge + '?league=ncaaf',
    Icon: (props: any) => <FootballIcon {...props} />,
  },
  TENNIS: {
    link: UrlPaths.Challenge + '?league=tennis',
    Icon: (props: any) => <TennisIcon {...props} />,
  },
  MMA: {
    link: UrlPaths.Challenge + '?league=mma',
    Icon: (props: any) => <BoxingIcon {...props} />,
  },
  GOLF: {
    link: UrlPaths.Challenge + '?league=pga',
    Icon: (props: any) => <GolfIcon {...props} />,
  },
  SOCCER: {
    link: UrlPaths.Challenge + '?league=mls',
    Icon: (props: any) => <SoccerIcon {...props} />,
  },
};
export default leagues;
