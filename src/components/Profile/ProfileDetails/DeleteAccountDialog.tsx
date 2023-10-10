import React from 'react';
import { Dialog, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const DeleteAccountValidationSchema = z
  .object({
    verify: z.string(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine(({ verify }) => verify.trim().toLowerCase() === 'delete my account', {
    message: "Type 'delete my account' to confirm",
    path: ['verify'],
  });
/**
 * Defines the form fields
 */
export type DeleteAccountInput = z.infer<typeof DeleteAccountValidationSchema>;

interface Props {
  open: boolean;
  close: () => void;
  deleteAccount: (data: DeleteAccountInput) => void;
}

export default function DeleteAccountDialog(props: Props) {
  const { open, close, deleteAccount } = props;
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(DeleteAccountValidationSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
    shouldUseNativeValidation: false,
  });

  const onSubmit = (data: DeleteAccountInput) => {
    return deleteAccount(data);
  };

  return (
    <Dialog open={open} maxWidth={'sm'} fullWidth>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={'bg-secondary text-white'}
      >
        <div
          className={
            'flex flex-row justify-between items-center bg-primary p-4 relative'
          }
        >
          <h2 className={'text-2xl font-bold text-white'}>
            Are you sure you want to do this?
          </h2>

          <IconButton
            onClick={close}
            sx={{
              position: 'absolute',
              right: 5,
              top: 5,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className={'flex flex-col p-4 space-y-6'}>
          <p>
            If you are sure you want to proceed with the deletion of your
            account, please continue below. Keep in mind this operation is
            irreversible and will result in complete deletion of all your data.
          </p>
          <TextField
            {...register('verify')}
            placeholder={'delete my account'}
            error={!!errors?.verify}
            helperText={errors?.verify?.message}
            label="To Verify, type 'delete my account'"
            size={'small'}
            variant={'outlined'}
          />

          <TextField
            {...register('password')}
            error={!!errors?.password}
            helperText={errors?.password?.message}
            label="Confirm your password"
            size={'small'}
            variant={'outlined'}
            type={'password'}
          />
          <button
            className={
              'text-red-500 bg-gray-200 rounded-md font-bold p-2 hover:text-white text-sm hover:bg-red-500'
            }
          >
            Delete this account
          </button>
        </div>
      </form>
    </Dialog>
  );
}
