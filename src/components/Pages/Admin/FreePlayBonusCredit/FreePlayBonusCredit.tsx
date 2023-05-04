import React, { useEffect } from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import UserAutocomplete from '~/components/Admin/Management/UserAutocomplete';
import {
  ManagementBaseProps,
  ManagementInputs,
} from '~/components/Admin/Management/Management';

const InputValidationSchema = Yup.object().shape({
  creditAmount: Yup.number().typeError('Please provide an amount'),
  user: Yup.object()
    .typeError('Please select user')
    .required('Please select user'),
});

interface FreePlayBonusCreditProps extends ManagementBaseProps {
  /**
   * Submit form function
   */
  onSubmit: (inputs: ManagementInputs) => void;
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const FreePlayBonusCredit = (props: FreePlayBonusCreditProps) => {
  const { onSubmit, users, isLoading, setSelectedUserId } = props;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    control,
  } = useForm<ManagementInputs>({
    resolver: yupResolver(InputValidationSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful]);

  return (
    <div className={'flex flex-col gap-2 py-4'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`flex flex-col md:flex-row items-start gap-4`}>
          <UserAutocomplete
            control={control}
            users={users}
            isLoading={isLoading}
            setSelectedUserId={setSelectedUserId}
          />
          <TextField
            id="outlined-basic"
            label="Amount"
            variant="outlined"
            type={'number'}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            {...register('creditAmount')}
            error={!!errors?.creditAmount}
            helperText={errors?.creditAmount?.message}
            size={'small'}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth={matches}
            name={'submit'}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FreePlayBonusCredit;
