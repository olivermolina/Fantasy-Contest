import React from 'react';
import { UrlPaths } from '~/constants/UrlPaths';
import Image from 'next/image';

type Props = {
  scale: number;
  isLoggedIn?: boolean;
};

export const Logo = (props: Props) => {
  return (
    <a
      target="_self"
      href={props.isLoggedIn ? UrlPaths.Challenge : '/'}
      rel="noreferrer"
    >
      <Image
        src="/assets/images/lockspread.svg"
        alt="LockSpread"
        width={14 * props.scale}
        height={18 * props.scale}
      />
    </a>
  );
};

Logo.defaultProps = {
  scale: 5,
};
