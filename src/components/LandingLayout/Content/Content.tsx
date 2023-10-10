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
import Image from 'next/image';
import { FadeInUpBox } from '~/components/FramerMotion/FadeInUpBox';

interface Props extends React.PropsWithChildren {
  cards: FantasyCardProps[];
  explainers: ExplainerCardProps[];
  banners: Banner[];
  isLoading: boolean;
  contentIsLoading: boolean;
  heading1: string;
  heading2: string;
}

const Content = (props: Props) => {
  const router = useRouter();
  return (
    <div className="flex-grow lg:flex lg:justify-center lg:items-center w-full">
      <div className={'flex flex-col gap-y-10 py-5'}>
        <ContentBanner banners={props.banners} isLoading={props.isLoading} />
        <ContentHeader
          heading1={props.heading1}
          heading2={props.heading2}
          isLoading={props.contentIsLoading}
        />
        <div
          className={
            'flex flex-col md:flex-row gap-4 justify-center items-stretch lg:max-w-5xl lg:mx-auto'
          }
        >
          {props.cards?.map((card, index) => (
            <FadeInUpBox
              key={card.playerName}
              duration={1}
              delayOrder={index + 1}
              className={'flex w-full'}
            >
              <FantasyCard {...card} />
            </FadeInUpBox>
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

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-5 lg:max-w-5xl mx-auto">
          {props.explainers?.map((explainer) => (
            <ExplainerCard {...explainer} key={explainer.title} />
          ))}
        </div>
        <p className="text-white text-[36px] font-bold text-center tracking-normal">
          LockSpread is available in 23 states!
        </p>

        <p className="text-white text-[16px] font-bold text-center tracking-normal">
          If your state is highlighted in{' '}
          <span className="text-green-500">green</span> below, you are good to
          go!
        </p>

        <div className="h-full w-full xl:w-7/12 mx-auto relative pb-2">
          {/* States map */}
          <Image
            src={'/assets/images/USMap.svg'}
            alt="US States Map"
            layout={'responsive'}
            width={355}
            height={215}
          />
        </div>
      </div>
    </div>
  );
};

export default Content;
