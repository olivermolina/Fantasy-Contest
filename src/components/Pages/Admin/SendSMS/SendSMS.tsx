import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormHelperText, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as z from 'zod';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendSMSInputValidationSchema } from '~/schemas/SendSMSInputValidationSchema';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

/**
 * Defines the form fields for SendSMS form.
 */
export type SendSMSInput = z.infer<typeof SendSMSInputValidationSchema>;

export interface SMSUser {
  id: string;
  email: string;
  username: string | null;
  phone: number | null;
}

interface SendSMSProps {
  /**
   * Submit form function
   */
  onSubmit: (inputs: SendSMSInput) => void;
  users: SMSUser[];
}

export const SELECT_ALL: SMSUser = {
  id: 'SELECT_ALL',
  email: '',
  username: 'All Users',
  phone: null,
};

const SendSMS = (props: SendSMSProps) => {
  const { onSubmit, users } = props;
  const [userSelect, setUserSelect] = React.useState<string[]>([]);
  const handleRemove = (userId: string) => {
    setUserSelect((prev) =>
      prev.filter((item) => item !== userId && item !== SELECT_ALL.id),
    );
  };

  const handleChange = (event: SelectChangeEvent<typeof userSelect>) => {
    const {
      target: { value },
    } = event;

    // Select All
    if (
      value.indexOf(SELECT_ALL.id) > -1 &&
      userSelect.indexOf(SELECT_ALL.id) === -1
    ) {
      setUserSelect([SELECT_ALL.id]);
      return;
    }

    // Deselect All
    if (
      userSelect.indexOf(SELECT_ALL.id) > -1 &&
      value.indexOf(SELECT_ALL.id) === -1
    ) {
      setUserSelect([]);
      return;
    }

    const newValue =
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value;

    setUserSelect(
      newValue.length === users.length + 1
        ? newValue
        : newValue.filter((name) => name !== SELECT_ALL.id),
    );
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SendSMSInput>({
    resolver: zodResolver(SendSMSInputValidationSchema),
  });

  useEffect(() => {
    setValue('userIds', userSelect as [string, ...string[]]);
  }, [userSelect]);

  return (
    <div className={'flex flex-col gap-2 p-2'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`flex flex-col items-start gap-2`}>
          <FormControl fullWidth error={!!errors?.userIds}>
            <InputLabel id="select-users-label" shrink={true}>
              Users
            </InputLabel>
            <Select
              labelId="select-users-label"
              id="select-users"
              multiple
              value={userSelect}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={
                        [...users, SELECT_ALL].find((user) => user.id === value)
                          ?.username
                      }
                      onDelete={() => {
                        handleRemove(value);
                      }}
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                      deleteIcon={<DeleteIcon />}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
              notched={true}
            >
              <MenuItem value={SELECT_ALL.id}>
                <Checkbox checked={userSelect.indexOf(SELECT_ALL.id) > -1} />
                <ListItemText
                  primary={SELECT_ALL.username}
                  className={'italic text-gray-400'}
                />
              </MenuItem>

              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Checkbox checked={userSelect.indexOf(user.id) > -1} />
                  <ListItemText
                    primary={
                      <>
                        {user.username}{' '}
                        <em className={'italic text-gray-400'}>
                          {user.phone?.toString()}
                        </em>
                      </>
                    }
                  />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors?.userIds?.message}</FormHelperText>
          </FormControl>
          <TextField
            id="outlined-basic"
            label="SMS Body"
            variant="outlined"
            type={'number'}
            fullWidth
            {...register('textMessage')}
            error={!!errors?.textMessage}
            helperText={errors?.textMessage?.message}
            size={'small'}
            multiline
            rows={10}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth={matches}
            name={'submit'}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SendSMS;
