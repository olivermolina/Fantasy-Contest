import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const ucfirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

function Header() {
  const { pathname } = useRouter();
  const appName = 'LockSpread';

  const title = useMemo(
    () =>
      [pathname, appName].reduce((prev, n) => {
        if (prev === '/') return n;
        const p = prev.split('/');
        let path = p[p.length - 1];
        if (path && path !== null) {
          if ((path.match(/-/) || []).length > 0) {
            path = path
              .split('-')
              .reduce((p, n) => `${ucfirst(p)}-${ucfirst(n)}`);
          } else {
            path = ucfirst(path);
          }
          return `${path} | ${n}`;
        }
        return n;
      }),
    [pathname],
  );

  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}

export default Header;
