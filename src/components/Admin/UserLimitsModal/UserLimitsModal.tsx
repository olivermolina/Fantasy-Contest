import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
  onClose:
    | ((event: unknown, reason: 'backdropClick' | 'escapeKeyDown') => void)
    | undefined;
  isLoading: boolean;
  isOpen: boolean;
  onSubmit(data: { min: number; max: number }): Promise<void>;
  currentValues?: {
    username: string;
    min?: number | undefined;
    max?: number | undefined;
  };
};

const formSchema = z
  .object({
    username: z.string(),
    min: z.coerce.number().min(1),
    max: z.coerce.number(),
  })
  .refine((data) => data.max > data.min, {
    message: 'Maximum limit must be greater than minimum',
    path: ['max'],
  });

export const UserLimitsModal = (props: Props) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: props.currentValues,
    resolver: zodResolver(formSchema),
  });

  /**
   * This resets the modal values when opened. Without this
   * no default values would be shown as the modal is mounted only once.
   */
  useEffect(() => {
    if (props.isOpen) {
      reset(props.currentValues);
    }
  }, [props.isOpen]);

  return (
    <Dialog onClose={props.onClose} open={props.isOpen}>
      <DialogTitle>Update {props.currentValues?.username} Limits</DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit((data) => props.onSubmit(data))}
          className="flex"
        >
          <TextField
            {...register('username')}
            error={!!errors?.username}
            helperText={errors?.username?.message}
            defaultValue={props.currentValues?.username}
            label="Username"
          />
          <TextField
            {...register('min')}
            error={!!errors?.min}
            helperText={errors?.min?.message}
            defaultValue={props.currentValues?.min}
            type="number"
            label="Min"
          />
          <TextField
            {...register('max')}
            error={!!errors?.max}
            helperText={errors?.max?.message}
            defaultValue={props.currentValues?.max}
            type="number"
            label="Max"
          />
          <Button disabled={props.isLoading} type="submit">
            {props.isLoading ? 'Submitting...' : 'Update'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
