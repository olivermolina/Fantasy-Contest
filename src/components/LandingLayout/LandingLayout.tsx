import FooterLinks from '~/components/LandingLayout/FooterLinks';
import LandingHeader from './Header';
import { theme } from '~/components';
import { ThemeProvider } from '@mui/material/styles';

type Props = {
  children: any;
  isLoggedIn?: boolean;
};

const LandingLayout = (props: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <div className="flex bg-wave-img text-white flex-col bg-auto min-h-screen">
        {/* Header */}
        <LandingHeader isLoggedIn={props.isLoggedIn} />

        {/* Body */}
        <div className="flex-grow justify-center items-center">
          {props.children}
        </div>

        {/* Footer */}
        <FooterLinks isLoggedIn={props.isLoggedIn} />
      </div>
    </ThemeProvider>
  );
};

export default LandingLayout;
