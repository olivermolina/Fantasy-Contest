import React, { FC } from 'react';
import {
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ContactUsInput } from '~/server/routers/user/contactUs';

const InputValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().required('Email is required'),
  phoneNumber: Yup.string().required('Phone is required '),
});

interface Props {
  isLoading: boolean;
  onSubmit: (data: ContactUsInput) => void;
}

const CATEGORIES = ['Contests', 'Deposit', 'Withdrawal', 'Sign Up', 'Profile'];

const ContactUs: FC<Props> = (props) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ContactUsInput>({
    resolver: yupResolver(InputValidationSchema),
  });

  const onSubmit = async (data: ContactUsInput) => {
    await props.onSubmit(data);
    reset();
  };

  return (
    <div className={'flex flex-col p-5 gap-4 '}>
      <span className={'text-2xl lg:text-3xl font-bold'}>
        Reach out to us 24/7 with any Questions!
      </span>
      <div>
        <span className={'text-lg lg:text-xl font-semibold'}>
          We&lsquo;ll get back to you as soon as we can! You can reach us
          through any of the methods below:
        </span>
        <ul className="list-disc ml-5 lg:ml-10">
          <li>
            Email us at{' '}
            <a
              className={
                'underline hover:text-blue-800 visited:text-purple-600'
              }
              href="mailto:support@lockspread.com"
            >
              support@lockspread.com
            </a>
          </li>
          <li>
            Call us at{' '}
            <a
              className={
                'underline hover:text-blue-800 visited:text-purple-600'
              }
              href="tel:201-528-3915"
            >
              201-528-3915
            </a>
          </li>
        </ul>
      </div>
      <div className={'flex flex-col gap-2'}>
        <span className={'text-lg lg:text-xl font-semibold'}>
          Or use the form below:
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'bg-primary rounded-lg'}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Name *"
                variant="outlined"
                fullWidth
                {...register('name')}
                error={!!errors?.name}
                helperText={errors?.name?.message}
                disabled={props.isLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email *"
                variant="outlined"
                fullWidth
                {...register('email')}
                error={!!errors?.email}
                helperText={errors?.email?.message}
                disabled={props.isLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone *"
                variant="outlined"
                fullWidth
                {...register('phoneNumber')}
                error={!!errors?.phoneNumber}
                helperText={errors?.phoneNumber?.message}
                disabled={props.isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors?.category}>
                <InputLabel id="select-category-label" sx={{ color: 'white' }}>
                  Choose your category
                </InputLabel>
                <Select
                  labelId="select-category-label"
                  id="select-category"
                  label="Choose your category"
                  {...register('category')}
                  fullWidth
                  disabled={props.isLoading}
                  sx={(theme) => ({
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(228, 219, 233, 0.25)',
                      color: theme.palette.primary.dark,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(228, 219, 233, 0.25)',
                      backgroundColor: theme.palette.primary.dark,
                      color: theme.palette.primary.contrastText,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(228, 219, 233, 0.25)',
                      backgroundColor: theme.palette.primary.dark,
                      color: theme.palette.primary.contrastText,
                    },
                    '.MuiSvgIcon-root ': {
                      color: 'white',
                      fill: 'white',
                      backgroundColor: theme.palette.primary.light,
                    },
                  })}
                >
                  {CATEGORIES.map((category, i) => (
                    <MenuItem value={category} key={`category-${i}`}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.category?.message ? (
                  <FormHelperText>{errors?.category?.message}</FormHelperText>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="How can we help you?"
                variant="outlined"
                fullWidth
                multiline
                rows={5}
                {...register('description')}
                error={!!errors?.description}
                helperText={errors?.description?.message}
                disabled={props.isLoading}
              />
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
              <Button
                type={'submit'}
                variant={'contained'}
                size={'large'}
                sx={{ borderRadius: 10 }}
                disabled={props.isLoading}
              >
                Submit
                {props.isLoading && (
                  <CircularProgress sx={{ ml: 1 }} size={20} />
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
