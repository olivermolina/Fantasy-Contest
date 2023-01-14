import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useAppSelector } from '~/state/hooks';
import {
  Button,
  FormHelperText,
  InputAdornment,
  TextField,
} from '@mui/material';
import { trpc } from '~/utils/trpc';
import BackdropLoading from '~/components/BackdropLoading';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';

type Inputs = {
  creditAmount: number;
  userId: string;
};

const InputValidationSchema = Yup.object().shape({
  creditAmount: Yup.number()
    .typeError('Please provide deposit amount')
    .min(1, 'Minimum free credit is $1'),
  userId: Yup.string().required('Please select user'),
});

const ProfileManagementContainer = () => {
  const userDetails = useAppSelector((state) => state.profile.userDetails);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: yupResolver(InputValidationSchema),
  });

  const { data, isLoading } = trpc.user.users.useQuery();
  const mutation = trpc.user.addCredit.useMutation();

  const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
    try {
      await mutation.mutateAsync(inputs);
      await reset();
      const user = data?.find((item) => item.id === inputs.userId);
      toast.success(
        `You successfully added a free credit to ${
          user?.username || user?.email
        }.`,
      );
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong when adding a free credit.`,
      );
    }
  };

  if (!userDetails?.isAdmin)
    return (
      <p className="p-4">
        You don&lsquo;t have permission to access this page.
      </p>
    );

  return (
    <div className={`w-full lg:p-4`}>
      <BackdropLoading open={isLoading || mutation.isLoading} />
      <div className="flex flex-col p-6 gap-2 rounded-lg shadow-md p-4 gap-4">
        <p className="font-bold text-lg">Management</p>
        <div className={`flex flex-col justify-between gap-4`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`flex flex-row items-center gap-4`}>
              <InputLabel className={'font-bold'}>Add Free Credit: </InputLabel>
              <FormControl
                fullWidth
                className={'w-64'}
                error={!!errors?.userId}
              >
                <InputLabel id="select-user-label">Select User</InputLabel>
                <Select
                  labelId="select-user-label"
                  id="select-user"
                  label="Select User"
                  {...register('userId')}
                >
                  {data?.map((user) => (
                    <MenuItem value={user.id} key={user.id}>
                      {user.username || user.email}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.userId?.message ? (
                  <FormHelperText>{errors?.userId?.message}</FormHelperText>
                ) : null}
              </FormControl>
              <TextField
                id="outlined-basic"
                label="Credit Amount"
                variant="outlined"
                type={'number'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                {...register('creditAmount')}
                error={!!errors?.creditAmount}
                helperText={errors?.creditAmount?.message}
              />
              <Button variant="contained" type="submit">
                Add
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagementContainer;
