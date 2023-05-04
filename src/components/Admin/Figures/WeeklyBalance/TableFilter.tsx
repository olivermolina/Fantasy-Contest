import React from 'react';
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import DebouncedInput from '~/components/ContestDetail/Entries/DebouncedInput';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

dayjs.extend(weekday);

interface TableFilterProps {
  setDate: (value: ((prevState: Date) => Date) | Date) => void;
  globalFilter: string;
  setGlobalFilter: (value: ((prevState: string) => string) | string) => void;
  viewInactive: boolean;
  setViewInactive: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export default function TableFilter(props: TableFilterProps) {
  const { setGlobalFilter, globalFilter, setDate } = props;
  const [value, setValue] = React.useState<Dayjs | null>();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setViewInactive(event.target.checked);
  };

  const weeksAgoOnClick = (week: number) => {
    if (week === 0) {
      setDate(new Date());
      return;
    }
    const date = dayjs(new Date()).weekday(-(7 * week));
    setDate(date.toDate());
    setValue(date);
  };
  return (
    <div className={'flex flex-col gap-2 py-2'}>
      <div
        className={'flex flex-col md:flex-row gap-2 w-full lg:w-3/4 xl:w-1/2'}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            label="Day Week Date"
            renderInput={(params) => <TextField {...params} />}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              if (newValue) {
                setDate(newValue.toDate());
              }
            }}
          />
        </LocalizationProvider>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => {
            setGlobalFilter(String(value));
          }}
          placeholder={'Search'}
          debounce={200}
        />
        <FormControlLabel
          label={'View inactive only'}
          control={
            <Checkbox
              checked={props.viewInactive}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
        />
      </div>
      <div className={'flex flex-row-reverse gap-2 justify-end'}>
        {[...Array(9)].map((row, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => weeksAgoOnClick(index)}
            sx={{ minnWidth: 130 }}
          >
            {index > 1 ? `${index} weeks ago` : null}
            {index === 1 ? 'Last week' : null}
            {index === 0 ? 'This week' : null}
          </Button>
        ))}
      </div>
    </div>
  );
}
