import React from 'react';
import { Logo } from '~/components/Layout/Logo';
import { SocialLinks } from '~/components/SocialLinks/SocialLinks';
import { useRouter } from 'next/router';

interface Props {
  isLoggedIn?: boolean;
}

const Header = (props: Props) => {
  const router = useRouter();
  return (
    <div className="flex lg:justify-center lg:items-center w-full">
      <nav className="flex justify-between sticky top-0 z-50 w-full">
        <Logo isLoggedIn={props.isLoggedIn} />
        <span className={'flex-grow'} />

        <div className="flex items-center gap-4 lg:gap-10">
          <div className={'hidden md:block'}>
            <SocialLinks />
          </div>

          <div className="flex gap-4  items-center justify-between">
            {router?.pathname !== '/auth/sign-up' && (
              <button
                type="submit"
                className="p-4 px-auto lg:px-20 rounded-full font-bold text-xl bg-white text-secondary w-max max-h-[80px] hover:bg-blue-200"
                onClick={() => router.push('/auth/sign-up')}
              >
                Sign Up
              </button>
            )}
            {router?.pathname !== '/auth/login' && (
              <button
                type="submit"
                className="p-4 px-auto lg:px-20 text-white rounded-full bg-transparent hover:bg-primary font-bold text-xl bg-secondary border border-white max-h-[80px]"
                onClick={() => router.push('/auth/login')}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
