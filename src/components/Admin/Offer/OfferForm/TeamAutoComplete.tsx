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
import { IconButton, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

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
  onDeleteTeam: (team: Team) => Promise<Team | undefined>;
  setTeamFilterName: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  noBorder?: boolean;
  team?: TeamWithInputValue;
}

const newTeam = {
  id: 'NEW',
  name: '',
  code: '',
  inputValue: '',
};

export default function TeamAutoComplete(props: Props) {
  const {
    name,
    label,
    error,
    helperText,
    onAddTeam,
    onDeleteTeam,
    isLoading,
    setTeamFilterName,
    setValue,
    teams,
    control,
    team,
  } = props;
  const [open, toggleOpen] = React.useState(false);

  const handleClose = () => {
    setDialogValue(newTeam);
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState<TeamWithInputValue>(
    team || newTeam,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleClose();
    const newTeam = await onAddTeam({
      id: dialogValue.id,
      name: dialogValue.name,
      code: dialogValue.code,
    });
    if (newTeam) {
      setValue(name, newTeam);
      setDialogValue(newTeam);
    }
    event.stopPropagation();
  };

  const handleEditTeam = () => {
    if (team) {
      setDialogValue(team!);
      toggleOpen(true);
    }
  };

  const handleDeleteTeam = async () => {
    if (!team) {
      return;
    }

    const deletedTeam = await onDeleteTeam(team);
    if (deletedTeam) {
      setValue(name, null);
      setDialogValue(newTeam);
      toggleOpen(false);
    }
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
                  disableUnderline: props.noBorder,
                  endAdornment: (
                    <React.Fragment>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {field.value && (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Edit Team"
                            edge="end"
                            size={'small'}
                            onClick={handleEditTeam}
                          >
                            <EditIcon />
                          </IconButton>
                        </InputAdornment>
                      )}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                variant={props.noBorder ? 'standard' : 'outlined'}
                sx={
                  props.noBorder
                    ? {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '0',
                          padding: '0',
                        },
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
                          {
                            border: '1px solid #eee',
                          },
                      }
                    : null
                }
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
          <DialogTitle>
            {dialogValue.id === 'NEW' ? `Add a new team` : 'Edit team'}
          </DialogTitle>
          <DialogContent>
            {dialogValue.id === 'NEW' && (
              <DialogContentText>
                Did you miss any team in our list? Please, add it!
              </DialogContentText>
            )}
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
          <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
            {dialogValue.id !== 'NEW' ? (
              <Button
                onClick={handleDeleteTeam}
                className={'underline text-blue-500'}
              >
                Delete this team
              </Button>
            ) : (
              <span />
            )}
            <div className={'space-x-2'}>
              <Button type="submit" variant={'contained'}>
                Save
              </Button>
              <Button onClick={handleClose} variant={'outlined'}>
                Cancel
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
