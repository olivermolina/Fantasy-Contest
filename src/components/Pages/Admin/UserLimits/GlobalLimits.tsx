import { Button, TextField, Tooltip } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DefaultAppSettings } from '~/constants/AppSettings';
import InfoIcon from '@mui/icons-material/Info';

export const GlobalLimitFormValidationSchema = z
  .object({
    min: z.coerce.number().min(1),
    max: z.coerce.number(),
    maxDailyTotalBetAmount: z.coerce.number(),
    repeatEntries: z.coerce.number(),
  })
  .refine((data) => data.max > data.min, {
    message: 'Maximum limit must be greater than minimum',
    path: ['max'],
  });
type FormType = z.infer<typeof GlobalLimitFormValidationSchema>;

export interface UserLimitsProps {
  onSubmit: (data: FormType) => void;
  defaultValues: FormType;
}

export const GlobalLimits = (props: UserLimitsProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(GlobalLimitFormValidationSchema),
    defaultValues: props.defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <div className="flex my-2 gap-2">
        <TextField
          {...register('min')}
          error={!!errors?.min}
          helperText={errors?.min?.message}
          type="number"
          label="Global Min"
          size={'small'}
        />
        <TextField
          {...register('max')}
          error={!!errors?.max}
          helperText={errors?.max?.message}
          type="number"
          label="Global Max"
          size={'small'}
        />
        <div className={'flex'}>
          <TextField
            {...register('maxDailyTotalBetAmount')}
            error={!!errors?.maxDailyTotalBetAmount}
            helperText={errors?.maxDailyTotalBetAmount?.message}
            type="number"
            label="Global Max Daily Total Stake"
            size={'small'}
          />
          <Tooltip title={'Set 0 as no limits.'}>
            <InfoIcon color={'primary'} />
          </Tooltip>
        </div>

        <TextField
          {...register('repeatEntries')}
          error={!!errors?.repeatEntries}
          helperText={errors?.repeatEntries?.message}
          type="number"
          label="Repeat Entries"
          size={'small'}
        />
      </div>
      <Button type="submit" color={'primary'} variant={'contained'}>
        Save
      </Button>
    </form>
  );
};

GlobalLimits.defaultProps = {
  defaultValues: {
    min: DefaultAppSettings.MIN_BET_AMOUNT,
    max: DefaultAppSettings.MAX_BET_AMOUNT,
    repeatEntries: DefaultAppSettings.REPEAT_ENTRIES,
    maxDailyTotalBetAmount: DefaultAppSettings.MAX_DAILY_TOTAL_BET_AMOUNT,
  },
};

export default GlobalLimits;
