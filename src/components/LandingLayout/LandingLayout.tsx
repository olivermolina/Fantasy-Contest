import FooterLinks from '~/components/LandingLayout/FooterLinks';
import LandingHeader from './Header';
import { Header, theme } from '~/components';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';

type Props = {
  children: any;
  isLoggedIn?: boolean;
  title?: string;
  customHeader?: JSX.Element | React.ReactNode;
};

const LandingLayout = (props: Props) => {
  return (
    <ThemeProvider theme={theme}>
      {props.customHeader || <Header />}

      <main className="flex bg-wave-img text-white flex-col bg-auto min-h-screen px-5 py-2">
        {/* Header */}
        <LandingHeader isLoggedIn={props.isLoggedIn} />

        {/* Body */}
        <div className="flex-grow justify-center items-center">
          {props.children}
        </div>

        {/* Footer */}
        <FooterLinks isLoggedIn={props.isLoggedIn} />
      </main>
    </ThemeProvider>
  );
};

export default LandingLayout;
