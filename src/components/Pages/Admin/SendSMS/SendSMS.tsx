import React from 'react';
import { Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const InputValidationSchema = Yup.object().shape({
  textMessage: Yup.string().required('SMS body is required'),
});

export interface SendSMSInput {
  textMessage: string;
}

interface SendSMSProps {
  /**
   * Submit form function
   */
  onSubmit: (inputs: SendSMSInput) => void;
}

const SendSMS = (props: SendSMSProps) => {
  const { onSubmit } = props;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendSMSInput>({
    resolver: yupResolver(InputValidationSchema),
  });

  return (
    <div className={'flex flex-col gap-2'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`flex flex-col items-start gap-2`}>
          <TextField
            id="outlined-basic"
            label="SMS Body"
            variant="outlined"
            type={'number'}
            fullWidth
            {...register('textMessage')}
            error={!!errors?.textMessage}
            helperText={errors?.textMessage?.message}
            size={'small'}
            multiline
            rows={10}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth={matches}
            name={'submit'}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SendSMS;
