import React, { useEffect } from 'react';
import { Box, Button, FormHelperText, Switch, TextField } from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { BetStakeType } from '@prisma/client';
import FormControlLabel from '@mui/material/FormControlLabel';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BonusCreditLimitInputs,
  BonusCreditLimitValidationSchema,
} from '~/schemas/BonusCreditLimitValidationSchema';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface BonusCreditLimits {
  /**
   * Form data
   */
  data: BonusCreditLimitInputs;
  /**
   * Submit form function
   */
  onSubmit: (inputs: BonusCreditLimitInputs) => void;
  /**
   * Open add users free entry confirm dialog
   */
  openAddUsersFreeEntryConfirmDialog: () => void;
}

export default function BonusCreditLimits(props: BonusCreditLimits) {
  const { onSubmit, data, openAddUsersFreeEntryConfirmDialog } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<BonusCreditLimitInputs>({
    resolver: zodResolver(BonusCreditLimitValidationSchema),
    defaultValues: data,
  });

  const { fields } = useFieldArray({
    control,
    name: 'bonusCreditLimits',
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  return (
    <div className={'flex flex-col pt-4 w-full'}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                        sx={{ width: 300 }}
                        value={field.value}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                        fullWidth
                        disabled={!watch(`bonusCreditLimits.${index}.enabled`)}
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
                  {errors.bonusCreditLimits?.[index]?.stakeTypeOptions?.message}
                </FormHelperText>
              </FormControl>
            </div>
          ))}

          <div className={'flex flex-row gap-2 items-center w-full'}>
            <Controller
              name="signupFreeEntry"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch {...field} checked={field.value} color="primary" />
                  }
                  label={`Automatic "Free Entry" bonus balance at first sign up`}
                />
              )}
            />

            <TextField
              label={'Bonus Credit Limit Free Entry Equivalent'}
              variant="outlined"
              type={'number'}
              {...register('bonusCreditFreeEntryEquivalent')}
              error={!!errors?.bonusCreditFreeEntryEquivalent}
              helperText={errors?.bonusCreditFreeEntryEquivalent?.message}
              fullWidth
              sx={{ maxWidth: 290 }}
            />
          </div>

          <Button
            variant={'contained'}
            onClick={openAddUsersFreeEntryConfirmDialog}
            color={'warning'}
          >
            Apply &#39;Free Entry&#39; to existing users
          </Button>

          <Button variant="outlined" type="submit" name={'submit'}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
