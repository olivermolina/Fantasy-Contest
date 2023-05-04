import { trpc } from '~/utils/trpc';
import React, { useEffect, useMemo } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { AppSettingName } from '@prisma/client';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import BackdropLoading from '~/components/BackdropLoading';
import { fetchAppSettings } from '~/state/appSettings';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import BonusCreditLimits, {
  BonusCreditLimitsInputs,
} from '~/components/Pages/Admin/BonusCreditLimits/BonusCreditLimits';
import { fetchContestCategory } from '~/state/ui';

const BonusCreditLimitsContainer = () => {
  const dispatch = useAppDispatch();
  const mutation = trpc.admin.updateAppSettings.useMutation();
  const appSettings = useAppSelector((state) => state.appSettings);
  const contestCategories = useAppSelector(
    (state) => state.ui.contestCategories,
  );

  const onSubmit: SubmitHandler<BonusCreditLimitsInputs> = async (inputs) => {
    try {
      const { numberOfPlayers, stakeType, bonusCreditFreeEntryEquivalent } =
        inputs;
      await mutation.mutateAsync([
        {
          appSettingName: AppSettingName.NUMBER_OF_PLAYERS_FREE_ENTRY,
          value: numberOfPlayers.toString(),
        },
        {
          appSettingName: AppSettingName.STAKE_TYPE_FREE_ENTRY,
          value: stakeType.toString(),
        },
        {
          appSettingName: AppSettingName.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT,
          value: bonusCreditFreeEntryEquivalent.toString(),
        },
      ]);
      toast.success(`Saved successfully!`);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong! Please try again later.`,
      );
    }
  };
  const data = useMemo(
    () => ({
      numberOfPlayers: appSettings.NUMBER_OF_PLAYERS_FREE_ENTRY.split(','),
      stakeType: appSettings.STAKE_TYPE_FREE_ENTRY.split(',').filter((n) => n),
      bonusCreditFreeEntryEquivalent: Number(
        appSettings.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT,
      ),
    }),
    [appSettings],
  );

  useEffect(() => {
    dispatch(fetchAppSettings());
    dispatch(fetchContestCategory());
  }, [dispatch]);

  return (
    <>
      <BackdropLoading open={mutation.isLoading} />
      <BonusCreditLimits
        data={data}
        onSubmit={onSubmit}
        contestCategories={contestCategories || []}
      />
    </>
  );
};

export default BonusCreditLimitsContainer;
