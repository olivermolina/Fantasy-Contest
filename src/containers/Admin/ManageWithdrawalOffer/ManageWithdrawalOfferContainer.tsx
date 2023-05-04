import React, { useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import BackdropLoading from '~/components/BackdropLoading';
import ManageWithdrawalOffer, {
  WithdrawalOfferInputs,
} from '~/components/Pages/Admin/ManageWithdrawalOffer/ManageWithdrawalOffer';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { fetchAppSettings } from '~/state/appSettings';
import { trpc } from '~/utils/trpc';

import { AppSettingName } from '@prisma/client';

const ManageWithdrawalOfferContainer = () => {
  const dispatch = useAppDispatch();

  const mutation = trpc.admin.updateAppSettings.useMutation();

  const [maxOffer, matchMultiplier, weeklyOfferChance, isInitial] =
    useAppSelector((state) => [
      state.appSettings.MAX_RETENTION_BONUS,
      state.appSettings.RETENTION_BONUS_MATCH_MULTIPLIER,
      state.appSettings.RETENTION_BONUS_WEEKLY_CHANCE,
      state.appSettings.initial,
    ]);

  const onSubmit: SubmitHandler<WithdrawalOfferInputs> = async (inputs) => {
    try {
      await mutation.mutateAsync([
        {
          appSettingName: AppSettingName.MAX_RETENTION_BONUS,
          value: inputs.maxOffer.toString(),
        },
        {
          appSettingName: AppSettingName.RETENTION_BONUS_MATCH_MULTIPLIER,
          value: inputs.matchMultiplier.toString(),
        },
        {
          appSettingName: AppSettingName.RETENTION_BONUS_WEEKLY_CHANCE,
          value: inputs.weeklyOfferChance.toString(),
        },
      ]);
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
      <BackdropLoading open={isInitial || mutation.isLoading} />
      <ManageWithdrawalOffer
        onSubmit={onSubmit}
        maxOffer={Number(maxOffer)}
        matchMultiplier={Number(matchMultiplier)}
        weeklyOfferChance={Number(weeklyOfferChance)}
      />
    </>
  );
};

export default ManageWithdrawalOfferContainer;
