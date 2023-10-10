import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { ProfileManagementUser } from '~/components/Admin/Management/Management';
import z from 'zod';

interface UserAutocompleteProps {
  /**
   * List of users to be selected
   */
  users: ProfileManagementUser[];
  /**
   * Optional react hook for selected userId
   */
  setSelectedUserId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  /**
   * Boolean to show loading state in the select component
   */
  isLoading: boolean;
  /**
   * A React-Hook form control object
   */
  control: Control<any, any>;
  /**
   * Custom select label
   */
  label?: string;
  /**
   * Boolean to disable the select component
   */
  disabled?: boolean;
  defaultValue?: {
    id: string;
    username: string;
  };
}

export const UserSelectSchema = z.object({
  user: z.object(
    {
      id: z.string().optional(),
      username: z.string().optional(),
    },
    {
      required_error: 'Please select a user',
      invalid_type_error: 'Please select a user',
    },
  ),
});

const UserAutocomplete = (props: UserAutocompleteProps) => {
  const {
    users,
    setSelectedUserId,
    isLoading,
    control,
    disabled,
    defaultValue,
  } = props;
  return (
    <Controller
      render={({ field, fieldState }) => (
        <Autocomplete
          {...field}
          disablePortal
          disableClearable
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              // Do nothing
            } else {
              field.onChange(newValue);
              if (newValue?.id && setSelectedUserId) {
                setSelectedUserId(newValue.id);
              }
            }
          }}
          getOptionLabel={(option) => {
            // e.g value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            return option.username || option.email || '';
          }}
          id={'userId'}
          options={users || []}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderOption={(props, user) => (
            <li {...props}>{user.username || user.email}</li>
          )}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label={props.label || 'Select User'}
              fullWidth
              error={!!fieldState.error?.message}
              helperText={fieldState.error?.message}
              size={'small'}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          fullWidth
          disabled={disabled}
        />
      )}
      name={'user'}
      control={control}
      defaultValue={defaultValue || ''}
    />
  );
};

export default UserAutocomplete;
