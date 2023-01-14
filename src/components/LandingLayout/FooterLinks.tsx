import React from 'react';
import { Logo } from '~/components/Layout/Logo';
import { Grid } from '@mui/material';
import { UnderlinedLink } from '~/components/Nav/UnderlinedLink';
import Link from 'next/link';
import { SocialLinks } from '~/components/SocialLinks/SocialLinks';

const FooterLinks = () => (
  <footer className="flex flex-col md:flex-row px-2 md:px-10 py-4 border-t border-gray-400 items-center gap-4 md:gap-5 place-content-between">
    <div
      className={'flex flex-col md:flex-row justify-center items-center gap-1'}
    >
      <Logo scale={4} />
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        spacing={{ sx: 1, md: 2 }}
      >
        <Grid item>
          <UnderlinedLink>
            <Link href="/refund-policy" className="text-xs md:text-base">
              Refund Policy
            </Link>
          </UnderlinedLink>
        </Grid>
        <Grid item>
          <UnderlinedLink>
            <Link href="/privacy-policy" className="text-xs md:text-base">
              Privacy policy
            </Link>
          </UnderlinedLink>
        </Grid>
        <Grid item>
          <UnderlinedLink>
            <Link href="/terms" className="text-xs md:text-base">
              Terms and conditions
            </Link>
          </UnderlinedLink>
        </Grid>
        <Grid item>
          <UnderlinedLink>
            <Link href="/contest-rules" className="text-xs md:text-base">
              Contest rules
            </Link>
          </UnderlinedLink>
        </Grid>
        <Grid item>
          <UnderlinedLink>
            <Link href="/responsible-gaming" className="text-xs md:text-base">
              Responsible Gaming
            </Link>
          </UnderlinedLink>
        </Grid>
        <Grid item>
          <UnderlinedLink>
            <Link href="#" className="text-xs md:text-base">
              FAQ
            </Link>
          </UnderlinedLink>
        </Grid>
        <Grid item>
          <UnderlinedLink>
            <Link href="/contact-us" className="text-xs md:text-base">
              Contact us
            </Link>
          </UnderlinedLink>
        </Grid>
      </Grid>
    </div>
    <div className="flex flex-col items-center gap-4">
      <span className="text-sm font-bold text-gray-200">
        Follow us on social media
      </span>
      <SocialLinks />
    </div>
  </footer>
);

export default FooterLinks;
