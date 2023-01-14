import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { UserDetailsInput } from '~/lib/tsevo-gidx/GIDX';
import WarningIcon from '@mui/icons-material/Warning';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

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
  } = useForm<UserDetailsInput>({
    resolver: yupResolver(InputValidationSchema),
    defaultValues: props.verifiedData,
  });
  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs(props.verifiedData?.dob || new Date()),
  );

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  return (
    <Dialog
      open={props.open}
      PaperProps={{
        style: { borderRadius: 25 },
      }}
      maxWidth={'md'}
      fullWidth
    >
      <form onSubmit={handleSubmit(props.onSubmit)}>
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={{ xs: 2, md: 5 }}
            sx={(theme) => ({
              borderRadius: 5,
              p: 1,
              [theme.breakpoints.up('sm')]: {
                p: 3,
              },
              backgroundColor: hasError
                ? theme.palette.error.main
                : theme.palette.primary.main,
            })}
          >
            <Stack>
              <Typography
                sx={(theme) => ({
                  fontSize: 25,
                  color: hasError
                    ? theme.palette.primary.contrastText
                    : theme.palette.error.contrastText,
                })}
              >
                {hasError
                  ? "Sorry, we can't move forward"
                  : 'Verify your account'}
              </Typography>
              {hasError && (
                <Typography
                  sx={(theme) => ({
                    color: hasError
                      ? theme.palette.primary.contrastText
                      : theme.palette.error.contrastText,
                  })}
                >
                  {
                    "We couldn't verify your account. If you need help, you can send us an email or call."
                  }
                </Typography>
              )}
            </Stack>
            {hasError ? (
              <WarningIcon
                sx={(theme) => ({
                  fontSize: 40,
                  color: hasError
                    ? theme.palette.primary.contrastText
                    : theme.palette.error.contrastText,
                })}
              />
            ) : (
              <CheckCircleIcon
                sx={(theme) => ({
                  fontSize: 40,
                  color: hasError
                    ? theme.palette.primary.contrastText
                    : theme.palette.error.contrastText,
                })}
              />
            )}
          </Stack>
        </Box>

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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label="Date of Birth"
                inputFormat="MM/DD/YYYY"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    fullWidth
                    {...register('dob')}
                    error={!!errors?.dob}
                    helperText={errors?.dob?.message}
                  />
                )}
                value={value}
                onChange={handleChange}
              />
            </LocalizationProvider>
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
          <Grid item xs={12}>
            <Button
              onClick={props.handleClose}
              size={'large'}
              fullWidth
              disabled={props.isLoading}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
};

export default GetVerifiedDialog;
