import React, { useEffect } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  Select,
  Skeleton,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { yupResolver } from '@hookform/resolvers/yup';
import { TransactionType } from '@prisma/client';
import * as Yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { showDollarPrefix } from '~/utils/showDollarPrefix';
import { UserTotalBalanceInterface } from '~/server/routers/user/userTotalBalance/getUserTotalBalance';
import UserAutocomplete from '~/components/Admin/Management/UserAutocomplete';
import Typography from '@mui/material/Typography';
import {
  ManagementBaseProps,
  ManagementInputs,
} from '~/components/Admin/Management/Management';

const InputValidationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError('Please provide amount')
    .min(1, 'Minimum amount is 1'),
  user: Yup.object()
    .typeError('Please select user')
    .required('Please select user'),
  transactionType: Yup.string()
    .typeError('Please select transaction type')
    .required('Please select transaction type'),
});

interface AddRemoveWithdrawableProps extends ManagementBaseProps {
  /**
   * Submit form function
   */
  onSubmit: (inputs: ManagementInputs) => void;
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
  /**
   * Selected user total balance
   */
  userTotalBalance?: UserTotalBalanceInterface;
}

const ManageAmountAvailableToWithdraw = (props: AddRemoveWithdrawableProps) => {
  const { onSubmit, users, isLoading, setSelectedUserId, userTotalBalance } =
    props;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    resetField,
    control,
  } = useForm<ManagementInputs>({
    resolver: yupResolver(InputValidationSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) resetField('amount');
  }, [isSubmitSuccessful]);

  return (
    <div className={'flex flex-col gap-2'}>
      <Typography>
        Add or remove balance from the amount available to withdraw
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`flex flex-col md:flex-row items-start gap-4`}>
          <UserAutocomplete
            control={control}
            users={users}
            isLoading={isLoading}
            setSelectedUserId={setSelectedUserId}
          />
          <FormControl
            fullWidth
            error={!!errors?.transactionType}
            size={'small'}
          >
            <InputLabel id="select-transactionType-label">
              Select transaction type
            </InputLabel>
            <Select
              labelId="select-transactionType-label"
              id="select-transactionType"
              label="Select transaction type"
              {...register('transactionType')}
              fullWidth
              size={'small'}
            >
              {[TransactionType.CREDIT, TransactionType.DEBIT].map(
                (transactionType, i) => (
                  <MenuItem value={transactionType} key={`category-${i}`}>
                    {transactionType}
                  </MenuItem>
                ),
              )}
            </Select>
            {errors?.transactionType?.message ? (
              <FormHelperText>
                {errors?.transactionType?.message}
              </FormHelperText>
            ) : null}
          </FormControl>
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
            {...register('amount')}
            error={!!errors?.amount}
            helperText={errors?.amount?.message}
            size={'small'}
          />
          <Button variant="contained" type="submit" fullWidth={matches}>
            Submit
          </Button>
        </div>
        <div className={'flex flex-col gap-2 mt-2'}>
          <p className={'flex flex-row'}>
            Amount Available to withdraw:
            <span className={'font-bold ml-1'}>
              {isLoading ? (
                <Skeleton variant={'text'} sx={{ width: 20 }} />
              ) : (
                showDollarPrefix(
                  userTotalBalance?.withdrawableAmount || 0,
                  true,
                )
              )}
            </span>
          </p>
          <p className={'flex flex-row'}>
            Cash Balance:
            <span className={'font-bold ml-1'}>
              {isLoading ? (
                <Skeleton variant={'text'} sx={{ width: 20 }} />
              ) : (
                showDollarPrefix(userTotalBalance?.totalCashAmount || 0, true)
              )}
            </span>
          </p>
          <p className={'flex flex-row'}>
            Bonus Balance:
            <span className={'font-bold ml-1'}>
              {isLoading ? (
                <Skeleton variant={'text'} sx={{ width: 20 }} />
              ) : (
                showDollarPrefix(userTotalBalance?.creditAmount || 0, true)
              )}
            </span>
          </p>
          <p className={'flex flex-row'}>
            Total Balance:
            <span className={'font-bold ml-1'}>
              {isLoading ? (
                <Skeleton variant={'text'} sx={{ width: 20 }} />
              ) : (
                showDollarPrefix(userTotalBalance?.totalAmount || 0, true)
              )}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ManageAmountAvailableToWithdraw;
