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
import { Banner } from '@prisma/client';

interface Props extends React.PropsWithChildren {
  cards: FantasyCardProps[];
  explainers: ExplainerCardProps[];
  banners: Banner[];
  isLoading: boolean;
}

const Content = (props: Props) => {
  const router = useRouter();
  return (
    <div className={'flex flex-col gap-y-10 p-5 items-center '}>
      <ContentBanner banners={props.banners} isLoading={props.isLoading} />
      <ContentHeader />
      <div
        className={
          'flex flex-col lg:flex-row gap-2 justify-center items-stretch'
        }
      >
        {props.cards?.map((card) => (
          <FantasyCard key={card.playerName} {...card} />
        ))}
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="p-4 px-10 py-3 md:py-4 md:px-20 text-white rounded-full bg-transparent hover:bg-primary font-bold text-xl border border-white"
          onClick={() => router.push('/auth/sign-up')}
        >
          Sign Up
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-5">
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
