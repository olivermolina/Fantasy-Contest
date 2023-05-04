import React, { useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { BetStakeType, ContestCategory } from '@prisma/client';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

const InputValidationSchema = Yup.object().shape({
  numberOfPlayers: Yup.array().min(
    1,
    'Please provide number of players required.',
  ),
  bonusCreditFreeEntryEquivalent: Yup.number()
    .typeError('Please provide an amount')
    .min(10, 'Minimum is 10.'),
  stakeType: Yup.array().min(1, 'Must have at least one stake type to apply'),
});

export interface BonusCreditLimitsInputs {
  numberOfPlayers: string[];
  bonusCreditFreeEntryEquivalent: number;
  stakeType: string[];
}

interface BonusCreditLimits {
  /**
   * Form data
   */
  data: BonusCreditLimitsInputs;
  /**
   * Submit form function
   */
  onSubmit: (inputs: BonusCreditLimitsInputs) => void;
  /**
   * Available contest pick categories in the system
   */
  contestCategories: ContestCategory[];
}

export default function BonusCreditLimits(props: BonusCreditLimits) {
  const { onSubmit, data, contestCategories } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    reset,
  } = useForm<BonusCreditLimitsInputs>({
    resolver: yupResolver(InputValidationSchema),
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  return (
    <div className={'flex flex-col pt-4'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`flex flex-col items-start gap-4`}>
          <FormControl component="fieldset" error={!!errors?.stakeType}>
            <FormLabel component="legend">Number of Players</FormLabel>
            <FormGroup row>
              <Controller
                name="numberOfPlayers"
                control={control}
                render={({ field }) => (
                  <>
                    {contestCategories.map((contestCategory) => (
                      <FormControlLabel
                        {...field}
                        key={contestCategory.id}
                        label={contestCategory.numberOfPicks}
                        control={
                          <Checkbox
                            checked={getValues('numberOfPlayers').includes(
                              contestCategory.numberOfPicks.toString(),
                            )}
                            onChange={() => {
                              if (!field.value) {
                                field.onChange([
                                  contestCategory.numberOfPicks.toString(),
                                ]);
                                return;
                              }

                              if (
                                !field.value?.includes(
                                  contestCategory.numberOfPicks.toString(),
                                )
                              ) {
                                field.onChange([
                                  ...field.value,
                                  contestCategory.numberOfPicks.toString(),
                                ]);
                                return;
                              }

                              const items = field.value.filter(
                                (item) =>
                                  item !==
                                  contestCategory.numberOfPicks.toString(),
                              );
                              field.onChange(items);
                            }}
                          />
                        }
                      />
                    ))}
                  </>
                )}
              />
            </FormGroup>
            <FormHelperText>{errors?.stakeType?.message}</FormHelperText>
          </FormControl>

          <TextField
            id="outlined-basic"
            label="Bonus Credit Free Entry Equivalent"
            variant="outlined"
            type={'number'}
            {...register('bonusCreditFreeEntryEquivalent')}
            error={!!errors?.bonusCreditFreeEntryEquivalent}
            helperText={errors?.bonusCreditFreeEntryEquivalent?.message}
            size={'small'}
          />

          <FormControl component="fieldset" error={!!errors?.stakeType}>
            <FormLabel component="legend">
              Select entry stake type to apply:
            </FormLabel>
            <FormGroup row>
              <Controller
                name="stakeType"
                control={control}
                render={({ field }) => (
                  <>
                    {[
                      BetStakeType.ALL_IN.toString(),
                      BetStakeType.INSURED.toString(),
                    ].map((stakeType) => (
                      <FormControlLabel
                        {...field}
                        key={stakeType}
                        label={stakeType}
                        control={
                          <Checkbox
                            checked={getValues('stakeType').includes(stakeType)}
                            onChange={() => {
                              if (!field.value) {
                                field.onChange([stakeType]);
                                return;
                              }

                              if (!field.value?.includes(stakeType)) {
                                field.onChange([...field.value, stakeType]);
                                return;
                              }

                              const newCategories = field.value.filter(
                                (item) => item !== stakeType,
                              );
                              field.onChange(newCategories);
                            }}
                          />
                        }
                      />
                    ))}
                  </>
                )}
              />
            </FormGroup>
            <FormHelperText>{errors?.stakeType?.message}</FormHelperText>
          </FormControl>

          <Button variant="contained" type="submit" name={'submit'}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
