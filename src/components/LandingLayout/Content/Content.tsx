import React from 'react';
import ContentBanner from './ContentBanner';
import ContentHeader from './ContentHeader';
import {
  FantasyCard,
  FantasyCardProps,
} from '~/components/FantasyPicker/FantasyCard';
import { useRouter } from 'next/router';
import ExplainerCard, {
  ExplainerCardProps,
} from '~/components/LandingLayout/Content/ExplainerCard';
import { Grid } from '@mui/material';
import { Banner } from '@prisma/client';

interface Props extends React.PropsWithChildren {
  cards: FantasyCardProps[];
  explainers: ExplainerCardProps[];
  banners: Banner[];
}

const Content = (props: Props) => {
  const router = useRouter();
  return (
    <div className={'flex flex-col gap-y-10 p-5'}>
      <ContentBanner banners={props.banners} />
      <ContentHeader />
      <Grid container spacing={2} justifyContent={'center'}>
        {props.cards?.map((card) => (
          <Grid item key={card.playerName}>
            <FantasyCard {...card} />
          </Grid>
        ))}
      </Grid>
      <div className="flex justify-center">
        <button
          type="submit"
          className="p-4 px-10 py-3 md:py-4 md:px-20 text-white rounded-full bg-transparent hover:bg-blue-500 font-bold text-xl bg-blue-600 border border-white"
          onClick={() => router.push('/auth/sign-up')}
        >
          Sign Up
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-5">
        {props.explainers?.map((explainer) => (
          <ExplainerCard {...explainer} key={explainer.title} />
        ))}
      </div>
      <p className="text-white text-[36px] font-bold text-center tracking-normal">
        LockSpread is available in 24 states
      </p>

      <p className="text-white text-[16px] font-bold text-center tracking-normal">
        If your state is highlighted in{' '}
        <span className="text-green-500">green</span> below, you are good to go!
      </p>

      {/* States map */}
      <img
        src={'/assets/images/USMap.svg'}
        className="object-cover md:w-6/12 mx-auto"
        alt=""
      />
    </div>
  );
};

export default Content;
