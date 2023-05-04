import React, { useEffect } from 'react';
import { trpc } from '~/utils/trpc';
import { Skeleton } from '@mui/material';
import RewardCard from '~/components/RewardCard';
import { fetchAppSettings } from '~/state/appSettings';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { UrlPaths } from '~/constants/UrlPaths';
import { Banner } from '@prisma/client';
import { useRouter } from 'next/router';

const RewardContainer = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading } = trpc.appSettings.banners.useQuery();
  const appSettings = useAppSelector((state) => state.appSettings);

  useEffect(() => {
    dispatch(fetchAppSettings());
  }, [dispatch]);

  const handleClick = async (banner: Banner) => {
    switch (banner.priority) {
      case 1:
        await router.push(UrlPaths.ProfileAccountDeposit);
        break;
      case 2:
        await router.push(UrlPaths.ProfileReferral);
        break;
    }
  };

  return (
    <div
      className={
        'flex flex-col gap-6 h-full w-full p-5 bg-gradient-to-t from-primary to-secondary'
      }
    >
      <p className={'text-3xl text-white font-bold mb-1'}> Available Rewards</p>
      {isLoading && (
        <Skeleton variant="rectangular" height={150} width={'100%'} />
      )}
      <div className={'flex flex-wrap gap-6'}>
        {data?.map((banner) => (
          <RewardCard
            key={banner.id}
            banner={banner}
            appSettings={appSettings}
            handleClick={() => handleClick(banner)}
          />
        ))}
      </div>
    </div>
  );
};

export default RewardContainer;
