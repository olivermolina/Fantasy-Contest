import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Switch,
  TextField,
} from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import UserAutocomplete, {
  UserSelectSchema,
} from '~/components/Admin/Management/UserAutocomplete';
import { ProfileManagementUser } from '~/components/Admin/Management/Management';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { BetStakeType } from '@prisma/client';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import { MenuProps } from '~/components/Pages/Admin/BonusCreditLimits/BonusCreditLimits';
import {
  UserLimitInputs,
  UserLimitValidationSchema,
} from '~/schemas/UserLimitValidationSchema';
import z from 'zod';
import DialogActions from '@mui/material/DialogActions';

const UserLimitFormSchema = z.intersection(
  UserLimitValidationSchema,
  UserSelectSchema,
);

export type UserLimitFormType = z.infer<typeof UserLimitFormSchema>;

type Props = {
  onClose: () => void;
  isLoading: boolean;
  isOpen: boolean;
  onSubmit(data: UserLimitFormType): Promise<void>;
  currentValues?: UserLimitInputs;
  users: ProfileManagementUser[];
};

export const UserLimitsModal = (props: Props) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<UserLimitFormType>({
    defaultValues: props.currentValues,
    resolver: zodResolver(UserLimitFormSchema),
  });

  const { fields } = useFieldArray({
    control,
    name: 'bonusCreditLimits',
  });

  /**
   * This resets the modal values when opened. Without this
   * no default values would be shown as the modal is mounted only once.
   */
  useEffect(() => {
    if (props.isOpen) {
      const defaultValues = {
        ...props.currentValues,
        ...(props.currentValues?.userId !== '' && {
          user: {
            id: props.currentValues?.userId,
            username: props.currentValues?.username,
          },
        }),
      };
      reset(defaultValues);
    }
  }, [props.isOpen, props.currentValues, props.users]);

  const user = watch('user');

  useEffect(() => {
    if (user && user.id) {
      setValue('userId', user.id);
      setValue('username', user.username!);
    }
  }, [user]);
  return (
    <Dialog
      onClose={props.onClose}
      open={props.isOpen}
      fullWidth
      maxWidth={'md'}
    >
      <DialogTitle>
        {props.currentValues?.username || 'New User'} Limits
      </DialogTitle>
      <DialogContent>
        <form className="flex flex-col gap-4 p-2">
          <UserAutocomplete
            control={control}
            users={props.users}
            isLoading={false}
            disabled={!!props.currentValues?.username}
          />

          <TextField
            {...register('min')}
            error={!!errors?.min}
            helperText={errors?.min?.message}
            defaultValue={props.currentValues?.min}
            type="number"
            label="Min"
            size={'small'}
          />
          <TextField
            {...register('max')}
            error={!!errors?.max}
            helperText={errors?.max?.message}
            defaultValue={props.currentValues?.max}
            type="number"
            label="Max"
            size={'small'}
          />
          <TextField
            {...register('maxDailyTotalBetAmount')}
            error={!!errors?.maxDailyTotalBetAmount}
            helperText={errors?.maxDailyTotalBetAmount?.message}
            defaultValue={props.currentValues?.maxDailyTotalBetAmount}
            type="number"
            label="Max Daily Total Bet Amount"
            size={'small'}
          />
          <TextField
            {...register('repeatEntries')}
            error={!!errors?.repeatEntries}
            helperText={errors?.repeatEntries?.message}
            defaultValue={props.currentValues?.repeatEntries}
            type="number"
            label="Repeat Entries"
            size={'small'}
          />

          {/*Bonus Credit Limits*/}

          <span className={'font-semibold'}>Bonus Credit Limits</span>
          <div className={`flex flex-col items-start gap-4 w-full`}>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={'flex flex-row gap-2 items-center w-full'}
              >
                <FormControl sx={{ minWidth: 125 }}>
                  <Controller
                    name={`bonusCreditLimits.${index}.enabled`}
                    control={control}
                    defaultValue={false}
                    render={({ field: switchField }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...switchField}
                            checked={switchField.value}
                            color="primary"
                          />
                        }
                        label={`${field.numberOfPicks} picks`}
                      />
                    )}
                  />
                </FormControl>
                <TextField
                  {...register(
                    `bonusCreditLimits.${index}.bonusCreditFreeEntryEquivalent`,
                  )}
                  error={
                    !!errors.bonusCreditLimits?.[index]
                      ?.bonusCreditFreeEntryEquivalent
                  }
                  helperText={
                    errors.bonusCreditLimits?.[index]
                      ?.bonusCreditFreeEntryEquivalent?.message
                  }
                  type="number"
                  label="Bonus Credit Limit Free Entry Equivalent"
                  fullWidth
                  disabled={!watch(`bonusCreditLimits.${index}.enabled`)}
                  sx={{ maxWidth: 300 }}
                />
                <FormControl
                  component="fieldset"
                  error={!!errors.bonusCreditLimits?.[index]?.stakeTypeOptions}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-label">
                    Select entry stake type to apply
                  </InputLabel>
                  <FormGroup row>
                    <Controller
                      name={`bonusCreditLimits.${index}.stakeTypeOptions`}
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Select Entry Stake to Apply"
                            />
                          }
                          onChange={field.onChange}
                          value={field.value}
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => (
                                <Chip key={value} label={value} />
                              ))}
                            </Box>
                          )}
                          MenuProps={MenuProps}
                          fullWidth
                          disabled={
                            !watch(`bonusCreditLimits.${index}.enabled`)
                          }
                        >
                          {[
                            BetStakeType.ALL_IN.toString(),
                            BetStakeType.INSURED.toString(),
                          ].map((stakeType) => (
                            <MenuItem key={stakeType} value={stakeType}>
                              {stakeType}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormGroup>
                  <FormHelperText>
                    {
                      errors.bonusCreditLimits?.[index]?.stakeTypeOptions
                        ?.message
                    }
                  </FormHelperText>
                </FormControl>
              </div>
            ))}
          </div>

          <TextField
            {...register('notes')}
            error={!!errors?.notes}
            helperText={errors?.notes?.message}
            defaultValue={props.currentValues?.notes}
            label="Notes"
            size={'small'}
            multiline
            rows={4}
          />
        </form>
      </DialogContent>

      <DialogActions>
        <div className={'flex gap-4 w-full px-4'}>
          <Button onClick={props.onClose} variant={'outlined'} fullWidth>
            Cancel
          </Button>
          <Button
            disabled={props.isLoading}
            onClick={handleSubmit((data) => props.onSubmit(data))}
            variant={'contained'}
            fullWidth
          >
            {props.isLoading ? 'Submitting...' : 'Save'}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};
