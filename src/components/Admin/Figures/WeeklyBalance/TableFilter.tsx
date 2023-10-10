import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import en from 'dayjs/locale/en';
import utc from 'dayjs/plugin/utc';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import DebouncedInput from '~/components/ContestDetail/Entries/DebouncedInput';

const localeObject = {
  ...en,
  weekStart: 1,
  formats: {
    // abbreviated format options allowing localization
    LTS: 'h:mm:ss A',
    LT: 'h:mm A',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm A',
    LLLL: 'dddd, MMMM D, YYYY h:mm A',
    // lowercase/short, optional formats for localization
    l: 'D/M/YYYY',
    ll: 'D MMM, YYYY',
    lll: 'D MMM, YYYY h:mm A',
    llll: 'ddd, MMM D, YYYY h:mm A',
  },
};
dayjs.extend(utc);
dayjs.locale(localeObject);
dayjs.extend(weekday);

interface TableFilterProps {
  setDate: (value: ((prevState: Date) => Date) | Date) => void;
  globalFilter: string;
  setGlobalFilter: (value: ((prevState: string) => string) | string) => void;
  viewInactive: boolean;
  setViewInactive: (value: ((prevState: boolean) => boolean) | boolean) => void;
  includeEntryFee: boolean;
  setIncludeEntryFeeOnClick: (value: boolean) => void;
}

export default function TableFilter(props: TableFilterProps) {
  const { setGlobalFilter, globalFilter, setDate } = props;
  const [value, setValue] = React.useState<Dayjs | null>(dayjs().weekday(0));
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setViewInactive(event.target.checked);
  };

  const weeksAgoOnClick = (week: number) => {
    const dateInput =
      week === 0 ? dayjs().weekday(0) : dayjs(new Date()).weekday(-(7 * week));
    setDate(dateInput.toDate());
    setValue(dateInput);
  };

  return (
    <div className={'flex flex-col gap-2 py-2 w-full'}>
      <div className={'flex flex-col md:flex-row gap-2 w-full'}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            label="Day Week Date"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              if (newValue) {
                setDate(newValue.toDate());
              }
            }}
          />
        </LocalizationProvider>
        <div className={'w-full lg:max-w-sm'}>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => {
              setGlobalFilter(String(value));
            }}
            placeholder={'Search'}
            debounce={200}
          />
        </div>
        <div className={'flex flex-row gap-2 w-full'}>
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
          <FormControlLabel
            label={'Include Entry Fee'}
            control={
              <Checkbox
                checked={props.includeEntryFee}
                onChange={(event) =>
                  props.setIncludeEntryFeeOnClick(event.target.checked)
                }
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
          />
        </div>
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
