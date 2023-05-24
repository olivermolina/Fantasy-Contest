import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { AdminModuleByCategoryType } from '~/server/routers/admin/getModulePermissions';
import ModuleUserPermissions from './ModuleUserPermissions';
import Button from '@mui/material/Button';
import { UserPermissionFormValidationSchema } from '~/server/routers/admin/saveModulePermissions';

export type UserPermissionFormInputs = z.infer<
  typeof UserPermissionFormValidationSchema
>;

interface Props {
  userId: string;
  userPermissions: AdminModuleByCategoryType[];
  onSubmit: (data: UserPermissionFormInputs) => void;
  handleClose: () => void;
}

export default function UserPermissionsForm(props: Props) {
  const { userId, userPermissions, handleClose } = props;
  const { handleSubmit, control, reset } = useForm<UserPermissionFormInputs>({
    resolver: zodResolver(UserPermissionFormValidationSchema),
    defaultValues: {
      userId,
      userPermissions,
    },
  });
  const { fields } = useFieldArray({
    control,
    name: 'userPermissions',
  });

  useEffect(() => {
    reset({
      userId,
      userPermissions,
    });
  }, [userId, userPermissions]);

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <div className={'flex flex-col gap-4'}>
        {fields.map((field, index) => (
          <ModuleUserPermissions
            key={field.id}
            control={control}
            fieldIndex={index}
            userModule={{
              modulePermissions: field.modulePermissions,
              category: field.category,
            }}
          />
        ))}
        <div className={'flex justify-center gap-2 p-4'}>
          <Button variant={'outlined'} onClick={handleClose} sx={{ width: 75 }}>
            Cancel
          </Button>
          <Button type={'submit'} variant={'contained'} sx={{ width: 75 }}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
