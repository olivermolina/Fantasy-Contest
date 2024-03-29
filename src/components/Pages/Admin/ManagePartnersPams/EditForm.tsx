import React, { useEffect } from 'react';
import {
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import { User, UserStatus, UserType } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormControl from '@mui/material/FormControl';
import { ManagePartnersPamsRowModel } from './ManagePartnersPams';
import { NEW_USER_ID } from '~/constants/NewUserId';
import { mapUserTypeLabel } from '~/utils/mapUserTypeLabel';
import { USATimeZone } from '~/constants/USATimeZone';
import { EditFormValidationSchema } from '~/schemas/EditFormValidationSchema';

type USATimeZoneKey = keyof typeof USATimeZone;

/**
 * Defines the form fields for user form.
 */
export type EditFormInputs = z.infer<typeof EditFormValidationSchema>;

/**
 * Represents the properties of `UserForm` component.
 */
interface Props {
  user: ManagePartnersPamsRowModel;
  subAdminUsers: User[] | [];
  onSubmit: (data: EditFormInputs) => void;
  closeForm: () => void;
}

/**
 * Defines the `UserForm` component.
 */
export default function EditForm(props: Props) {
  const { user, subAdminUsers, closeForm } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm<EditFormInputs>({
    resolver: zodResolver(EditFormValidationSchema),
  });

  /**
   * Resets the form fields when `user` prop changes.
   */
  useEffect(() => {
    reset({
      id: user.id,
      username: user.username || '',
      password: user.id === NEW_USER_ID ? '' : user.username || '',
      email: user.email,
      phone: user.phone?.toString(),
      type: user.type,
      status: user.status === UserStatus.ACTIVE,
    });
  }, [user]);

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <p className={'bg-selected p-4 text-xl text-white font-bold'}>
        {user.id === NEW_USER_ID ? 'Add ' : 'Edit '} User
      </p>
      <div
        className={
          'flex flex-col  divide-y divide-dashed justify-center shadow-2xl'
        }
      >
        <div className={'grid grid-cols-3 lg:grid-cols-6 p-4 gap-2'}>
          <span className={'font-semibold'}>Active</span>
          <div className={'col-span-2 lg:col-span-5'}>
            <Controller
              name="status"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch {...field} checked={field.value} color="primary" />
                  }
                  label=""
                />
              )}
            />
          </div>
        </div>
        <div className={'grid grid-cols-3 lg:grid-cols-6 p-4 gap-2'}>
          <span className={'font-semibold'}>ID</span>
          <div className={'col-span-2 lg:col-span-5'}>
            <TextField
              variant={'outlined'}
              size={'small'}
              fullWidth
              {...register('id')}
              disabled
            />
          </div>
        </div>
        <div className={'grid grid-cols-3 lg:grid-cols-6 p-4 gap-2'}>
          <span className={'font-semibold'}>Email</span>
          <div className={'col-span-2 lg:col-span-5'}>
            <TextField
              variant={'outlined'}
              size={'small'}
              fullWidth
              {...register('email')}
              error={!!errors?.email}
              helperText={errors?.email?.message}
              disabled={user.id !== NEW_USER_ID}
            />
          </div>
        </div>
        <div className={'grid grid-cols-3 lg:grid-cols-6 p-4 gap-2'}>
          <span className={'font-semibold'}>Username</span>
          <div className={'col-span-2 lg:col-span-5'}>
            <TextField
              variant={'outlined'}
              size={'small'}
              fullWidth
              {...register('username')}
              error={!!errors?.username}
              helperText={errors?.username?.message}
              disabled={user.id !== NEW_USER_ID}
            />
          </div>
        </div>

        <div className={'grid grid-cols-3 lg:grid-cols-6 p-4 gap-2'}>
          <span className={'font-semibold'}>Password</span>
          <div className={'col-span-2 lg:col-span-5'}>
            <TextField
              type="password"
              variant={'outlined'}
              size={'small'}
              fullWidth
              {...register('password')}
              error={!!errors?.password}
              helperText={errors?.password?.message}
              disabled={user.id !== NEW_USER_ID}
            />
          </div>
        </div>
        <div className={'grid grid-cols-3 lg:grid-cols-6 p-4 gap-2'}>
          <span className={'font-semibold'}>Phone</span>
          <div className={'col-span-2 lg:col-span-5'}>
            <TextField
              type="number"
              variant={'outlined'}
              size={'small'}
              fullWidth
              {...register('phone')}
              error={!!errors?.phone}
              helperText={errors?.phone?.message}
            />
          </div>
        </div>
        <div className={'grid grid-cols-3 lg:grid-cols-6 p-4 gap-2'}>
          <span className={'font-semibold'}>Type</span>
          <div className={'col-span-2 lg:col-span-5'}>
            <Controller
              name="type"
              control={control}
              defaultValue={user.type}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors?.type} size={'small'}>
                  <Select size={'small'} fullWidth {...field}>
                    <MenuItem key={'empty-status'} value={undefined}>
                      <span className={'italic text-gray-400'}>
                        Select type
                      </span>
                    </MenuItem>
                    {[
                      UserType.SUB_ADMIN,
                      UserType.AGENT,
                      UserType.PLAYER,
                      UserType.ADMIN,
                    ].map((userType) => (
                      <MenuItem key={userType} value={userType}>
                        {mapUserTypeLabel(userType)}
                      </MenuItem>
                    ))}
                  </Select>

                  {errors?.type?.message ? (
                    <FormHelperText>{errors?.type?.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
          </div>
        </div>
        {watch('type') === UserType.AGENT && (
          <div className={'grid grid-cols-3 lg:grid-cols-6 p-4 gap-2'}>
            <span className={'font-semibold'}>PAM</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <Controller
                name="subAdminIds"
                control={control}
                defaultValue={user.subAdminIds || []}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors?.type} size={'small'}>
                    <Select size={'small'} fullWidth multiple {...field}>
                      <MenuItem key={'empty-status'} value={undefined}>
                        <span className={'italic text-gray-400'}>
                          Select PAM
                        </span>
                      </MenuItem>
                      {subAdminUsers.map((subAdminUser) => (
                        <MenuItem key={subAdminUser.id} value={subAdminUser.id}>
                          {subAdminUser.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>
        )}

        <div className={'grid grid-cols-3 lg:grid-cols-6 p-4 gap-2'}>
          <span className={'font-semibold'}>Timezone</span>
          <div className={'col-span-2 lg:col-span-5'}>
            <Controller
              name="timezone"
              control={control}
              defaultValue={user.timezone!}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors?.type} size={'small'}>
                  <Select size={'small'} fullWidth {...field}>
                    <MenuItem key={'empty-status'} value={undefined}>
                      <span className={'italic text-gray-400'}>
                        Select Timezone
                      </span>
                    </MenuItem>
                    {(Object.keys(USATimeZone) as USATimeZoneKey[]).map(
                      (key) => (
                        <MenuItem key={key} value={key}>
                          {USATimeZone[key]}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </div>
        <div className={'flex flex-row justify-between p-4'}>
          <Button variant={'outlined'} onClick={closeForm}>
            Cancel
          </Button>
          <Button variant={'contained'} type={'submit'}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
