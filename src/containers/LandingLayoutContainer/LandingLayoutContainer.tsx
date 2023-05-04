import React from 'react';
import LandingLayout from '~/components/LandingLayout';
import Content from '~/components/LandingLayout/Content';
import dayjs from 'dayjs';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import { trpc } from '~/utils/trpc';
import { Banner } from '@prisma/client';

const cards = [
  {
    id: '1',
    onClickLess: () => console.log('clicked'),
    onClickMore: () => console.log('clicked'),
    stat: 'Passing Yards',
    value: 99.5,
    gameInfo: 'DAL @ KC',
    playerName: 'Patrick Mahomes',
    image: '/assets/images/patrick-mahomes.png',
    playerPosition: 'QB',
    playerTeam: 'KC',
    matchTime: dayjs(new Date()).format('MM/DD/YYYY hh:mm A'),
    freeSquare: null,
  },
  {
    id: '2',
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
    freeSquare: null,
  },
  {
    id: '3',
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
    freeSquare: null,
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
    title: '24/7 Customer Support',
    description:
      'We are always looking for new ways to improve our website. Please contact us with any questions you have and provide as much feedback as you can. We are here to give you the best experience possible!  ',
    image: '/assets/images/support.svg',
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

interface Props {
  isLoggedIn?: boolean;
}

const LandingLayoutContainer = (props: Props) => {
  const { data, isLoading } = trpc.appSettings.banners.useQuery();

  return (
    <LandingLayout isLoggedIn={props.isLoggedIn}>
      <ChangeRouteLoadingContainer />
      <Content
        cards={cards}
        explainers={explainers}
        banners={data || DEFAULT_BANNERS}
        isLoading={isLoading}
      />
    </LandingLayout>
  );
};

export default LandingLayoutContainer;
