import { Button, TextField, Typography } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DefaultAppSettings } from '~/constants/AppSettings';

export const UserLimitFormValidationSchema = z
  .object({
    min: z.coerce.number().min(1),
    max: z.coerce.number(),
  })
  .refine((data) => data.max > data.min, {
    message: 'Maximum limit must be greater than minimum',
    path: ['max'],
  });
type FormType = z.infer<typeof UserLimitFormValidationSchema>;

export interface UserLimitsProps {
  onSubmit: (data: FormType) => void;
  defaultValues: FormType;
}

export const UserLimits = (props: UserLimitsProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(UserLimitFormValidationSchema),
    defaultValues: props.defaultValues,
  });

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <Typography variant="h5" className="my-4">
            Update Global Limits
          </Typography>
          <div className="my-2">
            <TextField
              {...register('min')}
              error={!!errors?.min}
              helperText={errors?.min?.message}
              type="number"
              label="Global Min"
            />
            <TextField
              {...register('max')}
              error={!!errors?.max}
              helperText={errors?.max?.message}
              type="number"
              label="Global Max"
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </div>
    </div>
  );
};

UserLimits.defaultProps = {
  defaultValues: {
    min: DefaultAppSettings.MIN_BET_AMOUNT,
    max: DefaultAppSettings.MAX_BET_AMOUNT,
  },
};
