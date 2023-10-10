import { FAQ } from '~/components/FAQ/FAQ';
import { faqs } from '../../constants/FAQLinks';
import LandingLayout from '~/components/LandingLayout';
import React from 'react';
import { Header } from '~/components';

export default function Help() {
  return (
    <LandingLayout
      customHeader={
        <Header>
          <meta name="description" content={`Hello, how can we help you?`} />
        </Header>
      }
    >
      <div className="flex-grow lg:flex lg:justify-center w-full">
        <div
          className={
            'flex flex-col gap-6 lg:max-w-5xl w-full justify-start py-5 px-5 lg:px-0'
          }
        >
          <h1 className={'text-2xl lg:text-3xl font-bold'}>Help Center</h1>
          <p className="text-xl font-semibold">Hello, how can we help you?</p>
          <FAQ faqs={faqs} />
        </div>
      </div>
    </LandingLayout>
  );
}
