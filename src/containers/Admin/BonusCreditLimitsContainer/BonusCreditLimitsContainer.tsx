import { trpc } from '~/utils/trpc';
import React, { useEffect, useMemo } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { AppSettingName } from '@prisma/client';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import BackdropLoading from '~/components/BackdropLoading';
import { fetchAppSettings } from '~/state/appSettings';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import BonusCreditLimits from '~/components/Pages/Admin/BonusCreditLimits/BonusCreditLimits';
import { fetchContestCategory } from '~/state/ui';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { BonusCreditLimitInputs } from '~/schemas/BonusCreditLimitValidationSchema';

const BonusCreditLimitsContainer = () => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const mutation = trpc.admin.updateAppSettings.useMutation();
  const addUsersFreeEntryMutation = trpc.admin.addUsersFreeEntry.useMutation();
  const saveBonusCreditLimitsMutation =
    trpc.admin.saveBonusCreditLimits.useMutation();
  const appSettings = useAppSelector((state) => state.appSettings);
  const contestCategories = useAppSelector(
    (state) => state.ui.contestCategories,
  );

  const onSubmit: SubmitHandler<BonusCreditLimitInputs> = async (inputs) => {
    try {
      await mutation.mutateAsync([
        {
          appSettingName: AppSettingName.SIGNUP_FREE_ENTRY,
          value: inputs.signupFreeEntry ? '1' : '0',
        },
        {
          appSettingName: AppSettingName.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT,
          value: inputs.bonusCreditFreeEntryEquivalent.toString(),
        },
      ]);
      await saveBonusCreditLimitsMutation.mutateAsync(inputs.bonusCreditLimits);
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
      signupFreeEntry: Number(appSettings.SIGNUP_FREE_ENTRY) == 1,
      bonusCreditFreeEntryEquivalent: Number(
        appSettings.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT,
      ),
      bonusCreditLimits:
        contestCategories?.map((category) => {
          return {
            contestCategoryId: category.id,
            numberOfPicks: category.numberOfPicks,
            id: category.bonusCreditLimit?.id || 'NEW',
            enabled: category.bonusCreditLimit?.enabled || false,
            bonusCreditFreeEntryEquivalent:
              Number(
                category.bonusCreditLimit?.bonusCreditFreeEntryEquivalent,
              ) || 0,
            stakeTypeOptions: category.bonusCreditLimit?.stakeTypeOptions || [],
          };
        }) || [],
    }),
    [appSettings, contestCategories],
  );

  const handleSubmitUsersFreeEntry = async () => {
    try {
      closeConfirmDialog();
      await addUsersFreeEntryMutation.mutateAsync();
      toast.success('Successfully added free entry to all users!');
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong! Please try again later.`,
      );
    }
  };

  useEffect(() => {
    dispatch(fetchAppSettings({ refetch: true }));
    dispatch(fetchContestCategory());
  }, [dispatch]);

  const openConfirmDialog = () => {
    setOpen(true);
  };

  const closeConfirmDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <BackdropLoading
        open={mutation.isLoading || addUsersFreeEntryMutation.isLoading}
      />
      <BonusCreditLimits
        data={data}
        onSubmit={onSubmit}
        openAddUsersFreeEntryConfirmDialog={openConfirmDialog}
      />
      <Dialog
        open={open}
        onClose={openConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Apply Free Entry?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to apply &#39;Free Entry&#39; to all existing
            users?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitUsersFreeEntry}
            variant={'outlined'}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BonusCreditLimitsContainer;
