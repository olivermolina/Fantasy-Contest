import React, { useEffect } from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const InputValidationSchema = Yup.object().shape({
  maxOffer: Yup.number()
    .typeError('Please provide a max bonus credit to offer.')
    .min(1, 'Minimum is $1'),
  matchMultiplier: Yup.number()
    .typeError('Please provide bonus match multiplier')
    .min(1, 'Minimum is 1'),
  weeklyOfferChance: Yup.number()
    .typeError('Please provide how many weekly offers are allowed.')
    .min(1, 'Minimum is 1'),
});

export interface WithdrawalOfferInputs {
  /**
   * Max bonus credit to offer
   * @example 500
   **/
  maxOffer: number;
  /**
   * Bonus match multiplier
   * @example 3
   **/
  matchMultiplier: number;
  /**
   * Withdrawal bonus credit weekly offers are allowed
   * @example 2
   **/
  weeklyOfferChance: number;
}

interface Props extends WithdrawalOfferInputs {
  /**
   * Submit form function
   */
  onSubmit: (inputs: WithdrawalOfferInputs) => void;
}

export default function ManageWithdrawalOffer(props: Props) {
  const { maxOffer, matchMultiplier, weeklyOfferChance, onSubmit } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WithdrawalOfferInputs>({
    resolver: yupResolver(InputValidationSchema),
  });

  useEffect(() => {
    reset({
      maxOffer,
      matchMultiplier,
      weeklyOfferChance,
    });
  }, [maxOffer, matchMultiplier, weeklyOfferChance]);

  return (
    <div className={'flex flex-col p-2 max-w-md'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`flex flex-col items-start gap-4`}>
          <TextField
            id="outlined-basic"
            label="Max Bonus Credit"
            variant="standard"
            type={'number'}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            {...register('maxOffer')}
            error={!!errors?.maxOffer}
            helperText={errors?.maxOffer?.message}
            size={'small'}
          />

          <TextField
            {...register('matchMultiplier')}
            id="outlined-basic"
            label="Bonus match multiplier"
            variant="standard"
            type={'number'}
            fullWidth
            error={!!errors?.matchMultiplier}
            helperText={errors?.matchMultiplier?.message}
            size={'small'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
          />

          <TextField
            id="outlined-basic"
            label="Weekly Offers Chances"
            variant="standard"
            type={'number'}
            fullWidth
            {...register('weeklyOfferChance')}
            error={!!errors?.weeklyOfferChance}
            helperText={errors?.weeklyOfferChance?.message}
            size={'small'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
          />

          <Button variant="contained" type="submit" fullWidth name={'submit'}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
