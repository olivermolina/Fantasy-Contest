import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import { Team } from '@prisma/client';
import { Controller } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress';
import { uniq } from 'lodash';

export interface TeamWithInputValue extends Team {
  inputValue?: string;
}

interface Props {
  teams: TeamWithInputValue[];
  label: string;
  name: string;
  control: any;
  error: boolean;
  helperText?: string;
  setValue: any;
  onAddTeam: (team: Team) => Promise<Team | undefined>;
  setTeamFilterName: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

export default function TeamAutoComplete(props: Props) {
  const {
    name,
    label,
    error,
    helperText,
    onAddTeam,
    isLoading,
    setTeamFilterName,
    setValue,
    teams,
    control,
  } = props;
  const [open, toggleOpen] = React.useState(false);

  const handleClose = () => {
    setDialogValue({
      id: '',
      name: '',
      code: '',
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    id: '',
    name: '',
    code: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleClose();
    const newTeam = await onAddTeam({
      id: 'NEW',
      name: dialogValue.name,
      code: dialogValue.code,
    });
    setValue(name, newTeam);
    event.stopPropagation();
  };

  return (
    <React.Fragment>
      <Controller
        render={({ field }) => (
          <Autocomplete
            {...field}
            loading={isLoading}
            onInputChange={(event, newInputValue) => {
              setTeamFilterName(newInputValue);
            }}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                // timeout to avoid instant validation of the dialog's form.
                setTimeout(() => {
                  toggleOpen(true);
                  setDialogValue({
                    id: 'NEW',
                    name: newValue,
                    code: '',
                  });
                });
              } else if (newValue && newValue.inputValue) {
                toggleOpen(true);
                setDialogValue({
                  id: 'NEW',
                  name: newValue.inputValue,
                  code: '',
                });
              } else {
                field.onChange(newValue);
              }
            }}
            filterOptions={(team) => team}
            id={name}
            options={uniq(teams)}
            getOptionLabel={(option) => {
              // e.g value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            renderOption={(props, option) => (
              <li {...props} key={`${option.id}-${option.name}-${name}`}>
                {option.name}
                <span className="text-sm ml-2 text-gray-500">
                  {option.code}
                </span>
              </li>
            )}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                fullWidth
                error={error}
                helperText={helperText}
                size={'small'}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            fullWidth
          />
        )}
        name={name}
        control={control}
        defaultValue={''}
      />
      <Dialog open={open} onClose={handleClose}>
        <form id="teamForm" onSubmit={handleSubmit}>
          <DialogTitle>Add a new team</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any team in our list? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  name: event.target.value,
                })
              }
              label="Name"
              type="text"
              variant="standard"
            />
            <span className={'mx-5'} />
            <TextField
              margin="dense"
              id="code"
              value={dialogValue.code}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  code: event.target.value,
                })
              }
              label="Code"
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
