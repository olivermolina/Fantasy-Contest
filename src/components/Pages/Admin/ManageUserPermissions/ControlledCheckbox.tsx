import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';

export default function ControlledCheckbox(props: {
  checked: boolean;
  label?: string;
}) {
  const [checked, setChecked] = React.useState(props.checked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={handleChange} />}
        label={props.label}
      />
    </FormGroup>
  );
}
