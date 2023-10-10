import React, { useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

export interface DateRangeInterface {
  startDate: Dayjs;
  endDate: Dayjs;
}

interface Props {
  setDateRangeValue: ({
    startDate,
    endDate,
  }: {
    startDate: ReturnType<typeof dayjs>;
    endDate: ReturnType<typeof dayjs>;
  }) => void;
  dateRangeValue: DateRangeInterface | null;
}

export default function PickDatePickerRange(props: Props) {
  const [dateRangeValue, setDateRangeValue] =
    React.useState<DateRangeInterface>({
      startDate: dayjs().subtract(7, 'day'),
      endDate: dayjs(),
    });

  useEffect(() => {
    if (props.dateRangeValue) setDateRangeValue(props.dateRangeValue);
  }, [props.dateRangeValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={'flex w-full justify-start gap-2'}>
        <MobileDatePicker
          label="Start Date"
          slotProps={{
            textField: {
              variant: 'outlined',
              fullWidth: true,
              size: 'small',
              margin: 'dense',
            },
          }}
          value={dateRangeValue.startDate}
          onChange={(selectedDate) => {
            setDateRangeValue((prevState) => ({
              ...prevState,
              startDate: selectedDate || prevState.startDate,
            }));
            props.setDateRangeValue({
              startDate: dayjs(selectedDate || props.dateRangeValue?.startDate),
              endDate: dayjs(props.dateRangeValue?.endDate),
            });
          }}
        />
        <MobileDatePicker
          label="End Date"
          slotProps={{
            textField: {
              variant: 'outlined',
              fullWidth: true,
              size: 'small',
              margin: 'dense',
            },
          }}
          value={dateRangeValue.endDate}
          onChange={(selectedDate) => {
            setDateRangeValue((prevState) => ({
              ...prevState,
              endDate: selectedDate || prevState.endDate,
            }));
            props.setDateRangeValue({
              startDate: dayjs(props.dateRangeValue?.startDate),
              endDate: dayjs(selectedDate || props.dateRangeValue?.endDate),
            });
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
