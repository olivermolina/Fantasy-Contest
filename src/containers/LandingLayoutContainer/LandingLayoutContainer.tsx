import React from 'react';
import LandingLayout from '~/components/LandingLayout';
import Content from '~/components/LandingLayout/Content';
import dayjs from 'dayjs';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import { trpc } from '~/utils/trpc';
import { Banner } from '@prisma/client';

const cards = [
  {
    onClickLess: () => console.log('clicked'),
    onClickMore: () => console.log('clicked'),
    stat: 'Passing Yards',
    value: 99.5,
    gameInfo: 'DAL @ DEN',
    playerName: 'Patrick Mahomes',
    image: '/assets/images/patrick-mahomes.png',
    playerPosition: 'QB',
    playerTeam: 'KC',
    matchTime: dayjs(new Date()).format('MM/DD/YYYY hh:mm A'),
  },
  {
    onClickLess: () => console.log('clicked'),
    onClickMore: () => console.log('clicked'),
    stat: 'Total Bases',
    value: 1.5,
    gameInfo: 'NYG @ NYY',
    playerName: 'Aaron Judge',
    image: '/assets/images/judge.png',
    playerPosition: 'OF',
    playerTeam: 'NYY',
    matchTime: dayjs(new Date()).format('MM/DD/YYYY hh:mm A'),
  },
  {
    onClickLess: () => console.log('clicked'),
    onClickMore: () => console.log('clicked'),
    stat: 'Points',
    value: 22.5,
    gameInfo: 'DAL @ MIL',
    playerName: 'Giannis Antetokounmpo',
    image: '/assets/images/giannis.png',
    playerPosition: 'F',
    playerTeam: 'MIL',
    matchTime: dayjs(new Date()).format('MM/DD/YYYY hh:mm A'),
  },
];

const explainers = [
  {
    title: 'Win Cash Prizes!',
    description:
      'Play More or Less to try and win up to 10x your cash! Or play our Daily/Weekly Token contests with friends to try and climb the leaderboards for cash prizes.',
    image: '/assets/images/prizes.svg',
  },
  {
    title: 'More or Less',
    description:
      "Our More or Less contest is exactly as it sounds. Pick 2-4 of your favorite player's as shown above and select if their stats will go Over or Under that amount to win 3x, 5x, or 10x your cash!",
    image: '/assets/images/up-down-arrow.svg',
  },
  {
    title: 'Token Contests',
    description:
      'Our Daily/Weekly Token contests gives every user 1000 tokens to start the contest. Place those 1000 tokens on any player\'s stats you want similar to"More or Less". Whoever ends up with the most tokens at the end wins cash depending on where they rank on our leaderboards.',
    image: '/assets/images/contest-trophy.svg',
  },
];

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'default1',
    text: 'LockSpread will match your first deposit up to $50!',
    priority: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'default2',
    text: 'Refer a friend from the link or code in your profile and get $25 in bonus credit!',
    priority: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const LandingLayoutContainer: React.FC = () => {
  const { data } = trpc.appSettings.banners.useQuery();

  return (
    <LandingLayout>
      <ChangeRouteLoadingContainer />
      <Content
        cards={cards}
        explainers={explainers}
        banners={data || DEFAULT_BANNERS}
      />
    </LandingLayout>
  );
};

export default LandingLayoutContainer;
