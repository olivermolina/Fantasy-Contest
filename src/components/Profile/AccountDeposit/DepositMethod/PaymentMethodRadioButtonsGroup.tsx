import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

export enum PaymentMethodRadioOptions {
  SAVED = 'saved',
  NEW = 'new',
}

interface Props {
  selectedPaymentMethodOptionCallback: (
    value: PaymentMethodRadioOptions,
  ) => void;
}

export default function PaymentMethodRadioButtonsGroup(props: Props) {
  const [value, setValue] = React.useState(PaymentMethodRadioOptions.SAVED);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = (event.target as HTMLInputElement)
      .value as PaymentMethodRadioOptions;
    setValue(newValue);
    props.selectedPaymentMethodOptionCallback(newValue);
  };

  return (
    <FormControl>
      <RadioGroup
        row
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel
          value={PaymentMethodRadioOptions.SAVED}
          control={<Radio />}
          label="Saved Payment Methods"
        />
        <FormControlLabel
          value={PaymentMethodRadioOptions.NEW}
          control={<Radio />}
          label="New"
        />
      </RadioGroup>
    </FormControl>
  );
}
