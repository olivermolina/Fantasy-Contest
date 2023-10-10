import React from 'react';
import { FootballIcon } from './submenu/football';
import { BasketballIcon } from './submenu/basketball';
import { BaseballIcon } from './submenu/baseball';
import { TrophyIcon } from './submenu/trophy';
import { TennisIcon } from './submenu/tennis';
import { BoxingIcon } from './submenu/boxing';
import { GolfIcon } from './submenu/golf';
import { SoccerIcon } from './submenu/soccer';
import { CSGoIcon } from './submenu/csgo';
import { DotaIcon } from './submenu/dota';
import { ValorantIcon } from './submenu/valorant';
import { RaceFlagIcon } from './submenu/race-flag';
import { GameControllerIcon } from './submenu/game-controller';
import { CricketIcon } from './submenu/cricket';
import { LoLIcon } from './submenu/lol';
import { UrlPaths } from '~/constants/UrlPaths';

export interface SportsIconProps {
  isSelected?: boolean;
}

const leagues = {
  NFL: {
    link: UrlPaths.Challenge + '?league=nfl',
    Icon: (props: any) => <FootballIcon {...props} />,
  },
  NFL1H: {
    link: UrlPaths.Challenge + '?league=nfl1h',
    Icon: (props: any) => <FootballIcon {...props} />,
  },
  NFL1Q: {
    link: UrlPaths.Challenge + '?league=nfl1q',
    Icon: (props: any) => <FootballIcon {...props} />,
  },
  NFL2H: {
    link: UrlPaths.Challenge + '?league=nfl2h',
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
  CSGO: {
    link: UrlPaths.Challenge + '?league=csgo',
    Icon: (props: any) => <CSGoIcon {...props} />,
  },
  NASCAR: {
    link: UrlPaths.Challenge + '?league=nascar',
    Icon: (props: any) => <RaceFlagIcon {...props} />,
  },
  F1: {
    link: UrlPaths.Challenge + '?league=f1',
    Icon: (props: any) => <RaceFlagIcon {...props} />,
  },
  KBO: {
    link: UrlPaths.Challenge + '?league=kbo',
    Icon: (props: any) => <BaseballIcon {...props} />,
  },
  BOXING: {
    link: UrlPaths.Challenge + '?league=boxing',
    Icon: (props: any) => <BoxingIcon {...props} />,
  },
  DOTA2: {
    link: UrlPaths.Challenge + '?league=dota2',
    Icon: (props: any) => <DotaIcon {...props} />,
  },
  LOL: {
    link: UrlPaths.Challenge + '?league=lol',
    Icon: (props: any) => <LoLIcon {...props} />,
  },
  COD: {
    link: UrlPaths.Challenge + '?league=cod',
    Icon: (props: any) => <GameControllerIcon {...props} />,
  },
  VALORANT: {
    link: UrlPaths.Challenge + '?league=valorant',
    Icon: (props: any) => <ValorantIcon {...props} />,
  },
  USFL: {
    link: UrlPaths.Challenge + '?league=usfl',
    Icon: (props: any) => <FootballIcon {...props} />,
  },
  WNBA: {
    link: UrlPaths.Challenge + '?league=wnba',
    Icon: (props: any) => <BasketballIcon {...props} />,
  },
  CRICKET: {
    link: UrlPaths.Challenge + '?league=cricket',
    Icon: (props: any) => <CricketIcon {...props} />,
  },
  NBA1H: {
    link: UrlPaths.Challenge + '?league=nba1h',
    Icon: (props: any) => <BasketballIcon {...props} />,
  },
  NBA1Q: {
    link: UrlPaths.Challenge + '?league=nba1q',
    Icon: (props: any) => <BasketballIcon {...props} />,
  },
  CFL: {
    link: UrlPaths.Challenge + '?league=cfl',
    Icon: (props: any) => <FootballIcon {...props} />,
  },
  BASKETBALL: {
    link: UrlPaths.Challenge + '?league=basketball',
    Icon: (props: any) => <BasketballIcon {...props} />,
  },
};
export default leagues;
