import { Dialog } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchAppSettings } from '~/state/manageContent';
import BackdropLoading from '~/components/BackdropLoading';
import { TRPCClientError } from '@trpc/client';
import { SubmitHandler } from 'react-hook-form';
import BannerForm, {
  BannerFormInputs,
} from '~/components/Pages/Admin/ManageContent/BannerForm';
import ManageBanners, {
  ContentSettingFormSchemaType,
  ManageBannerRowModel,
} from '~/components/Pages/Admin/ManageContent/ManageBanners';
import { trpc } from '~/utils/trpc';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { AppSettingName } from '@prisma/client';

const AppSettingsOptions = [
  AppSettingName.MAX_MATCH_DEPOSIT_AMOUNT.toString(),
  AppSettingName.MIN_DEPOSIT_AMOUNT.toString(),
  AppSettingName.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT.toString(),
  AppSettingName.REFERRAL_CREDIT_AMOUNT.toString(),
  AppSettingName.RELOAD_BONUS_AMOUNT.toString(),
  AppSettingName.MAX_RETENTION_BONUS.toString(),
];

export const ManageBannersContainer = () => {
  const dispatch = useAppDispatch();
  const contentSettings = useAppSelector((state) => state.contentSettings);
  const [selectedBanner, setSelectedBanner] =
    useState<ManageBannerRowModel | null>(null);
  const { data, isLoading, refetch } = trpc.appSettings.banners.useQuery();
  const mutation = trpc.admin.saveBanner.useMutation();
  const mutationAppSetting = trpc.admin.updateAppSettings.useMutation();
  const { data: appSettingsData } = trpc.appSettings.list.useQuery();

  const banners = useMemo(() => data || [], [data]);

  const openBannersForm = (banner: ManageBannerRowModel) => {
    setSelectedBanner(banner);
  };

  const closeForm = () => {
    setSelectedBanner(null);
  };

  const formSubmit: SubmitHandler<ContentSettingFormSchemaType> = async (
    inputs,
  ) => {
    try {
      await mutationAppSetting.mutateAsync([
        {
          appSettingName: AppSettingName.CHALLENGE_PROMO_MESSAGE,
          value: inputs.challengePromoMessage,
        },
        {
          appSettingName: AppSettingName.REFERRAL_CUSTOM_TEXT,
          value: inputs.referralCustomText,
        },
        {
          appSettingName: AppSettingName.HOMEPAGE_HEADING_1,
          value: inputs.homePageHeading1,
        },
        {
          appSettingName: AppSettingName.HOMEPAGE_HEADING_2,
          value: inputs.homePageHeading2,
        },
      ]);

      dispatch(fetchAppSettings({ refetch: true }));
      toast.success(`Saved successfully.`);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong. Please try again later.`,
      );
    }
  };

  const onSubmit = async (formInputs: BannerFormInputs) => {
    try {
      await mutation.mutateAsync(formInputs);
      closeForm();
      await refetch();
      toast.success(`Saved successfully!`);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong! Please try again later.`,
      );
    }
  };

  const appSettings = useMemo(() => {
    return (
      appSettingsData?.allAppSettings.filter((appSetting) =>
        AppSettingsOptions.includes(appSetting.name.toString()),
      ) || []
    );
  }, [appSettingsData]);

  return (
    <>
      <BackdropLoading open={isLoading} />
      <ManageBanners
        banners={banners}
        openBannersForm={openBannersForm}
        contentSettings={contentSettings}
        onSubmit={formSubmit}
      />
      {selectedBanner && (
        <Dialog
          open={!!selectedBanner}
          onClose={closeForm}
          fullWidth
          maxWidth={'sm'}
        >
          <BannerForm
            banner={selectedBanner}
            onSubmit={onSubmit}
            closeForm={closeForm}
            appSettings={appSettings}
          />
        </Dialog>
      )}
    </>
  );
};
