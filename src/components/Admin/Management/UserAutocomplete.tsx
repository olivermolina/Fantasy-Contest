import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { ProfileManagementUser } from '~/components/Admin/Management/Management';

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
}

const UserAutocomplete = (props: UserAutocompleteProps) => {
  const { users, setSelectedUserId, isLoading, control } = props;
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
            return option.username || option.email;
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
        />
      )}
      name={'user'}
      control={control}
      defaultValue={''}
    />
  );
};

export default UserAutocomplete;
