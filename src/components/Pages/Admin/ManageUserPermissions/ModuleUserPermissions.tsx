import React from 'react';
import type { AdminModuleByCategoryType } from '~/server/routers/admin/getModulePermissions';
import { Control, Controller } from 'react-hook-form';
import { UserPermissionFormInputs } from './UserPermissionsForm';
import { Checkbox, FormControlLabel } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';

interface Props {
  fieldIndex: number;
  control: Control<UserPermissionFormInputs>;
  userModule: AdminModuleByCategoryType;
}

export default function ModuleUserPermissions(props: Props) {
  const { userModule, control } = props;
  return (
    <div className={'flex flex-col'}>
      <p className={'py-2 px-6 bg-selected text-white font-semibold'}>
        {userModule.category}
      </p>
      <div
        className={'grid grid-cols-3 divide-x divide-y content-center border'}
      >
        {userModule.modulePermissions.map((modulePermission, index) => (
          <Controller
            key={modulePermission.moduleId}
            control={control}
            name={`userPermissions.${props.fieldIndex}.modulePermissions.${index}.checked`}
            render={({ field: { onChange, value } }) => (
              <FormGroup sx={{ py: '0.25rem', pl: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => onChange(e.target.checked)}
                      checked={value}
                    />
                  }
                  label={modulePermission.label}
                />
              </FormGroup>
            )}
            defaultValue={false}
          />
        ))}
      </div>
    </div>
  );
}
