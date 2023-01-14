import React from 'react';
import { Logo } from '~/components/Layout/Logo';
import { SocialLinks } from '~/components/SocialLinks/SocialLinks';
import { useRouter } from 'next/router';
import Head from 'next/head';

const HEADER_CONTENTS = {
  title: 'LockSpread | Daily Fantasy Player Props',
  description:
    'The best customer service in all of fantasy sports! We will match your first deposit! Select More or Less on player stats to win up to 10x your cash!',
  imageUrl: 'https://www.lockspread.com/icon-512x512.png',
  websiteUrl: 'https://www.lockspread.com',
  domain: 'lockspread.com',
};

const Header = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        {/* HTML Meta Tags */}
        <title>LockSpread</title>
        <meta name="description" content={HEADER_CONTENTS.description} />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content={HEADER_CONTENTS.websiteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={HEADER_CONTENTS.title} />
        <meta property="og:description" content={HEADER_CONTENTS.description} />
        <meta property="og:image" content={HEADER_CONTENTS.imageUrl} />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={HEADER_CONTENTS.domain} />
        <meta property="twitter:url" content={HEADER_CONTENTS.websiteUrl} />
        <meta name="twitter:title" content={HEADER_CONTENTS.title} />
        <meta
          name="twitter:description"
          content={HEADER_CONTENTS.description}
        />
        <meta name="twitter:image" content={HEADER_CONTENTS.imageUrl} />

        <meta name="theme-color" content="#2463eb" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png"></link>
      </Head>
      <nav className="flex px-5 md:px-10 items-center justify-between sticky top-0 z-50 bg-wave-img">
        <Logo />
        <div className="flex items-center gap-4 lg:gap-10">
          <div className={'hidden md:block'}>
            <SocialLinks />
          </div>

          <div className="flex gap-4  items-center justify-between">
            {router?.pathname !== '/auth/sign-up' && (
              <button
                type="submit"
                className="p-4 px-auto lg:px-20 rounded-full font-bold text-xl bg-white text-blue-600 w-max max-h-[80px] hover:bg-blue-200"
                onClick={() => router.push('/auth/sign-up')}
              >
                Sign Up
              </button>
            )}
            {router?.pathname !== '/auth/login' && (
              <button
                type="submit"
                className="p-4 px-auto lg:px-20 text-white rounded-full bg-transparent hover:bg-blue-500 font-bold text-xl bg-blue-600 border border-white max-h-[80px]"
                onClick={() => router.push('/auth/login')}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
