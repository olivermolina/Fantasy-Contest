import React, { useEffect } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { UserDetailsInput } from '~/lib/tsevo-gidx/GIDX';
import WarningIcon from '@mui/icons-material/Warning';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import CloseIcon from '@mui/icons-material/Close';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const InputValidationSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  address1: Yup.string().required('Street Address is required '),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postalCode: Yup.string().required('Postal / Zip code is required'),
  dob: Yup.string().required('Date of Birth is required'),
});

interface Props {
  handleClose: () => void;
  open: boolean;
  onSubmit: (data: UserDetailsInput) => void;
  isLoading: boolean;
  hasError?: boolean;
  verifiedData?: UserDetailsInput;
}

const GetVerifiedDialog = (props: Props) => {
  const { hasError } = props;

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm<UserDetailsInput>({
    resolver: yupResolver(InputValidationSchema),
    defaultValues: {
      ...props.verifiedData,
      dob: dayjs.tz(props.verifiedData?.dob || new Date(), 'America/New_York'),
    },
  });

  useEffect(() => {
    reset({
      ...props.verifiedData,
      dob: dayjs.tz(props.verifiedData?.dob || new Date(), 'America/New_York'),
    });
  }, [props.verifiedData]);

  return (
    <Dialog
      open={props.open}
      sx={(theme) => ({
        '& .MuiPaper-root': {
          backgroundColor: theme.palette.primary.main,
          borderRadius: 4,
        },
      })}
      maxWidth={'md'}
      fullWidth
    >
      <form onSubmit={handleSubmit(props.onSubmit)}>
        <div className={'flex justify-between items-center p-4'}>
          <div className={'flex justify-between items-center gap-5'}>
            <div className={'rounded-full p-1 lg:p-4 bg-[#1A487F]'}>
              <TaskAltIcon
                sx={(theme) => ({
                  [theme.breakpoints.up('md')]: {
                    fontSize: 40,
                  },
                  fontSize: 25,
                  color: theme.palette.primary.contrastText,
                })}
              />
            </div>
            <div className={'flex flex-col gap-2'}>
              <p className={'text-lg lg:text-3xl font-bold text-white'}>
                {hasError
                  ? "Sorry, we can't move forward"
                  : 'Verify your account'}
              </p>
              <p className={'text-sm lg:text-lg text-lightText'}>
                Fill out the details as shown on your license.
              </p>
            </div>
          </div>
          <IconButton onClick={props.handleClose}>
            <CloseIcon
              color="secondary"
              sx={(theme) => ({
                fontSize: 30,
                [theme.breakpoints.up('md')]: {
                  fontSize: 40,
                },
              })}
            />
          </IconButton>
        </div>
        <div className={'bg-slate-500 h-[0.025rem] mb-4'} />
        {hasError && (
          <div
            className={
              'flex p-2 m-4 rounded-lg font-bold text-[#92400E] border-red-500 border-1 bg-[#FFFBEB] gap-2 items-center'
            }
          >
            <WarningIcon />
            <span>
              {
                "We couldn't verify your account. If you need help, you can send us an email or call."
              }
            </span>
          </div>
        )}
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              label="First name"
              variant="outlined"
              fullWidth
              {...register('firstname')}
              error={!!errors?.firstname}
              helperText={errors?.firstname?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Last name"
              variant="outlined"
              fullWidth
              {...register('lastname')}
              error={!!errors?.lastname}
              helperText={errors?.lastname?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              control={control}
              name={'dob'}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    label="Date of Birth"
                    slotProps={{
                      textField: {
                        value: field.value || dayjs(),
                        variant: 'outlined',
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                    value={field.value || dayjs()}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address 1"
              variant="outlined"
              fullWidth
              {...register('address1')}
              error={!!errors?.address1}
              helperText={errors?.address1?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address 2"
              variant="outlined"
              fullWidth
              {...register('address2')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              {...register('city')}
              error={!!errors?.city}
              helperText={errors?.city?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="State"
              variant="outlined"
              fullWidth
              {...register('state')}
              error={!!errors?.state}
              helperText={errors?.state?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Postal/Zip Code"
              variant="outlined"
              fullWidth
              {...register('postalCode')}
              error={!!errors?.postalCode}
              helperText={errors?.postalCode?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type={'submit'}
              variant={'contained'}
              size={'large'}
              sx={{ borderRadius: 10 }}
              fullWidth
              disabled={props.isLoading}
            >
              {hasError ? 'Try Again' : 'Confirm'}
              {props.isLoading && <CircularProgress sx={{ ml: 1 }} size={20} />}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
};

export default GetVerifiedDialog;
