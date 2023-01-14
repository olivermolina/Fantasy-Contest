import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BackdropLoading from '~/components/BackdropLoading';

const ChangeRouteLoadingContainer = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) return;
      return url !== router.asPath && setLoading(true);
    };
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  return <BackdropLoading open={loading} />;
};

export default ChangeRouteLoadingContainer;
