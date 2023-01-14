import React from 'react';
import LandingHeader from './Header';
import FooterLinks from '~/components/LandingLayout/FooterLinks';

type Props = {
  children: any;
};

const LandingLayout = (props: Props) => {
  return (
    <div className="flex bg-wave-img text-white flex flex-col bg-auto min-h-screen">
      {/* Header */}
      <LandingHeader />

      {/* Body */}
      <div className="flex-grow justify-center items-center">
        {props.children}
      </div>

      {/* Footer */}
      <FooterLinks />
    </div>
  );
};

export default LandingLayout;
