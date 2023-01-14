import React, { useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Stack } from '@mui/material';

const InputValidationSchema = Yup.object().shape({
  startDate: Yup.string(),
  endDate: Yup.string(),
});

export interface DateRangeInterface {
  startDate: Dayjs;
  endDate: Dayjs;
}

interface Props {
  setDateRangeValue: React.Dispatch<
    React.SetStateAction<DateRangeInterface | null>
  >;
  dateRangeValue: DateRangeInterface | null;
}

export default function PickDatePickerRange(props: Props) {
  const { register, handleSubmit } = useForm<any>({
    resolver: yupResolver(InputValidationSchema),
  });

  const [dateRangeValue, setDateRangeValue] =
    React.useState<DateRangeInterface>({
      startDate: dayjs(new Date()).subtract(7, 'day'),
      endDate: dayjs(new Date()),
    });

  const onSubmit = (data: DateRangeInterface) => {
    props.setDateRangeValue(data);
  };

  useEffect(() => {
    if (props.dateRangeValue) setDateRangeValue(props.dateRangeValue);
  }, [props.dateRangeValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <MobileDatePicker
            label="Start Date"
            inputFormat="MM/DD/YYYY"
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                {...register('startDate')}
                size="small"
                margin="dense"
              />
            )}
            value={dateRangeValue.startDate}
            onChange={(selectedDate) =>
              setDateRangeValue((prevState) => ({
                ...prevState,
                startDate: selectedDate || prevState.startDate,
              }))
            }
          />
          <MobileDatePicker
            label="End Date"
            inputFormat="MM/DD/YYYY"
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                {...register('endDate')}
                size="small"
                margin="dense"
              />
            )}
            value={dateRangeValue.endDate}
            onChange={(selectedDate) =>
              setDateRangeValue((prevState) => ({
                ...prevState,
                endDate: selectedDate || prevState.endDate,
              }))
            }
          />
          <Button variant={'contained'} type={'submit'}>
            Load
          </Button>
        </Stack>
      </LocalizationProvider>
    </form>
  );
}
