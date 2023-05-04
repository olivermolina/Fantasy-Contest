import React, { useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import BackdropLoading from '~/components/BackdropLoading';
import { fetchAppSettings } from '~/state/appSettings';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import AppSettings, {
  AppSettingFormSchemaType,
} from '~/components/Pages/Admin/AppSettings/AppSettings';
import { trpc } from '~/utils/trpc';
import { AppSettingName } from '@prisma/client';

const AppSettingsContainer = () => {
  const dispatch = useAppDispatch();
  const appSettings = useAppSelector((state) => state.appSettings);
  const mutation = trpc.admin.updateAppSettings.useMutation();

  const onSubmit: SubmitHandler<AppSettingFormSchemaType> = async (inputs) => {
    try {
      await mutation.mutateAsync([
        {
          appSettingName: AppSettingName.MAX_MATCH_DEPOSIT_AMOUNT,
          value: inputs.maxMatchDepositAmount.toString(),
        },
        {
          appSettingName: AppSettingName.DEPOSIT_AMOUNT_OPTIONS,
          value: inputs.depositAmountOptions,
        },
        {
          appSettingName: AppSettingName.RELOAD_BONUS_TYPE,
          value: inputs.reloadBonusType,
        },
        {
          appSettingName: AppSettingName.RELOAD_BONUS_AMOUNT,
          value: inputs.reloadBonusAmount.toString(),
        },
        {
          appSettingName: AppSettingName.MAX_RETENTION_BONUS,
          value: inputs.maxRetentionBonus.toString(),
        },
        {
          appSettingName: AppSettingName.RETENTION_BONUS_WEEKLY_CHANCE,
          value: inputs.retentionBonusWeeklyChance.toString(),
        },
        {
          appSettingName: AppSettingName.RETENTION_BONUS_MATCH_MULTIPLIER,
          value: inputs.retentionBonusMatchMultiplier.toString(),
        },
        {
          appSettingName: AppSettingName.REFERRAL_CREDIT_AMOUNT,
          value: inputs.referralCreditAmount.toString(),
        },
        {
          appSettingName: AppSettingName.REFERRAL_CUSTOM_TEXT,
          value: inputs.referralCustomText,
        },
        {
          appSettingName: AppSettingName.MIN_BET_AMOUNT,
          value: inputs.minBetAmount.toString(),
        },
        {
          appSettingName: AppSettingName.MAX_BET_AMOUNT,
          value: inputs.maxBetAmount.toString(),
        },
        {
          appSettingName: AppSettingName.MIN_MARKET_ODDS,
          value: inputs.minMarketOdds.toString(),
        },
        {
          appSettingName: AppSettingName.MAX_MARKET_ODDS,
          value: inputs.maxMarketOdds.toString(),
        },
        {
          appSettingName: AppSettingName.CHALLENGE_PROMO_MESSAGE,
          value: inputs.challengePromoMessage,
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

  useEffect(() => {
    dispatch(fetchAppSettings());
  }, [dispatch]);

  return (
    <>
      <BackdropLoading open={mutation.isLoading} />
      <AppSettings onSubmit={onSubmit} appSettings={appSettings} />
    </>
  );
};

export default AppSettingsContainer;
