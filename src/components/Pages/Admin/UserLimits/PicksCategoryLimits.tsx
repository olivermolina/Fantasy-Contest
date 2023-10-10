import React, { useEffect } from 'react';
import { Button, FormControlLabel, Switch, TextField } from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PicksCategoryLimitFormValidationSchema } from '~/schemas/PicksCategoryLimitFormValidationSchema';

export type PicksCategoryLimitType = z.infer<
  typeof PicksCategoryLimitFormValidationSchema
>;

export interface PicksCategoryLimitsProps {
  onSubmit: (data: PicksCategoryLimitType) => void;
  defaultValues: PicksCategoryLimitType;
}

export const PicksCategoryLimits = (props: PicksCategoryLimitsProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<PicksCategoryLimitType>({
    resolver: zodResolver(PicksCategoryLimitFormValidationSchema),
    defaultValues: props.defaultValues,
  });

  const { fields } = useFieldArray({
    control,
    name: 'picksCategoryLimits',
  });

  useEffect(() => {
    reset(props.defaultValues);
  }, [props.defaultValues]);

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <div className={'flex flex-col gap-2 mb-2'}>
        {fields.map((field, index) => (
          <div key={field.id} className={'flex flex-row gap-2'}>
            <Controller
              name={`picksCategoryLimits.${index}.customStakeLimitEnabled`}
              control={control}
              defaultValue={false}
              render={({ field: switchField }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...switchField}
                      checked={switchField.value}
                      color="primary"
                    />
                  }
                  label={`${field.numberOfPicks} picks`}
                />
              )}
            />
            <TextField
              {...register(`picksCategoryLimits.${index}.minStakeAmount`)}
              error={!!errors.picksCategoryLimits?.[index]?.minStakeAmount}
              helperText={
                errors.picksCategoryLimits?.[index]?.minStakeAmount?.message
              }
              type="number"
              label="Min Stake Amount"
              size={'small'}
              disabled={
                !watch(`picksCategoryLimits.${index}.customStakeLimitEnabled`)
              }
            />
            <TextField
              {...register(`picksCategoryLimits.${index}.maxStakeAmount`)}
              error={!!errors.picksCategoryLimits?.[index]?.maxStakeAmount}
              helperText={
                errors.picksCategoryLimits?.[index]?.maxStakeAmount?.message
              }
              type="number"
              label="Max Stake Amount"
              size={'small'}
              disabled={
                !watch(`picksCategoryLimits.${index}.customStakeLimitEnabled`)
              }
            />
            <TextField
              {...register(
                `picksCategoryLimits.${index}.allInPayoutMultiplier`,
              )}
              error={
                !!errors.picksCategoryLimits?.[index]?.allInPayoutMultiplier
              }
              helperText={
                errors.picksCategoryLimits?.[index]?.allInPayoutMultiplier
                  ?.message
              }
              type="number"
              label="All-In Payout Multiplier"
              size={'small'}
              inputProps={{
                step: 0.01,
              }}
            />

            <TextField
              {...register(
                `picksCategoryLimits.${index}.primaryInsuredPayoutMultiplier`,
              )}
              error={
                !!errors.picksCategoryLimits?.[index]
                  ?.primaryInsuredPayoutMultiplier
              }
              helperText={
                errors.picksCategoryLimits?.[index]
                  ?.primaryInsuredPayoutMultiplier?.message
              }
              type="number"
              label="Insured Primary Payout Multiplier"
              size={'small'}
              inputProps={{
                step: 0.01,
              }}
            />

            <TextField
              {...register(
                `picksCategoryLimits.${index}.secondaryInsuredPayoutMultiplier`,
              )}
              error={
                !!errors.picksCategoryLimits?.[index]
                  ?.secondaryInsuredPayoutMultiplier
              }
              helperText={
                errors.picksCategoryLimits?.[index]
                  ?.secondaryInsuredPayoutMultiplier?.message
              }
              type="number"
              label="Insured Secondary Payout Multiplier"
              size={'small'}
              inputProps={{
                step: 0.01,
              }}
            />
          </div>
        ))}
      </div>
      <Button type="submit" variant={'contained'}>
        Save
      </Button>
    </form>
  );
};
