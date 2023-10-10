import React from 'react';
import dynamic from 'next/dynamic';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import LandingLayout from '~/components/LandingLayout';
import { Header } from '~/components';
import { HEADER_CONTENTS } from '~/pages/_document';
import Content from '~/components/LandingLayout/Content';
import dayjs from 'dayjs';
import { AppSettingName } from '@prisma/client';
import { trpcTransformer } from '~/utils/trpc';
import prisma from '~/server/prisma';
import AppStoreDialog from '~/components/AppStoreDialog/AppStoreDialog';

const ChangeRouteLoadingContainer = dynamic(
  () =>
    import(
      '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer'
    ),
  {
    ssr: false,
  },
);

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

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { banners, contentSettings } = props;

  return (
    <LandingLayout
      isLoggedIn={props.isLoggedIn}
      customHeader={
        <Header>
          {/* HTML Meta Tags */}
          <meta name="description" content={HEADER_CONTENTS.description} />
        </Header>
      }
    >
      <ChangeRouteLoadingContainer />
      <Content
        cards={cards}
        explainers={explainers}
        banners={banners || []}
        isLoading={false}
        heading1={contentSettings?.HOMEPAGE_HEADING_1 || ''}
        heading2={contentSettings?.HOMEPAGE_HEADING_2 || ''}
        contentIsLoading={false}
      />
      <AppStoreDialog />
    </LandingLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  /*
   * Prefetching banners and contentList here will make it so that the data is available
   */
  const banners = await prisma.banner.findMany({
    orderBy: {
      priority: 'asc',
    },
    select: {
      id: true,
      text: true,
      priority: true,
      appSetting: true,
    },
  });

  const contentList = await prisma.appSettings.findMany({
    where: {
      name: {
        in: [
          AppSettingName.CHALLENGE_PROMO_MESSAGE,
          AppSettingName.REFERRAL_CUSTOM_TEXT,
          AppSettingName.HOMEPAGE_HEADING_1,
          AppSettingName.HOMEPAGE_HEADING_2,
        ],
      },
    },
  });
  const contentSettings = contentList.reduce((acc, setting) => {
    acc[setting.name] = setting.value;
    return acc;
  }, {} as Record<AppSettingName, string>);

  return {
    props: {
      isLoggedIn: false,
      banners: trpcTransformer.parse(trpcTransformer.stringify(banners)),
      contentSettings: trpcTransformer.parse(
        trpcTransformer.stringify(contentSettings),
      ),
    },
    revalidate: 3600, // In 1 hour
  };
};

export default Home;
