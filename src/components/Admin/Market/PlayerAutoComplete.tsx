import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Player, Team } from '@prisma/client';
import { Controller } from 'react-hook-form';
import PlayerDialogForm from '~/components/Admin/Market/PlayerDialogForm';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { NEW_USER_ID } from '~/constants/NewUserId';

export type PlayerWithInputValue = Player & {
  Team?: Team | null;
  inputValue?: string;
};

interface Props {
  players: PlayerWithInputValue[];
  label: string;
  name: string;
  control: any;
  error: boolean;
  helperText?: string;
  setValue: any;
  onAddTeam: (team: Team) => Promise<Team | undefined>;
  onDeleteTeam: (team: Team) => Promise<Team | undefined>;
  onAddPlayer: (player: Player) => Promise<Player | undefined>;
  onDeletePlayer: (player: Player) => Promise<Player | undefined>;
  teams: Team[];
  isLoading: boolean;
  setPlayerFilterName: React.Dispatch<React.SetStateAction<string>>;
  teamIsLoading: boolean;
  setTeamFilterName: React.Dispatch<React.SetStateAction<string>>;
  noBorder?: boolean;
  player?: PlayerWithInputValue;
}

const defaultPlayer = {
  id: NEW_USER_ID,
  name: '',
  position: '',
  team: '',
  teamid: '',
  headshot: '',
};

export default function PlayerAutoComplete(props: Props) {
  const {
    teams,
    onAddTeam,
    onDeleteTeam,
    isLoading,
    setPlayerFilterName,
    teamIsLoading,
    setTeamFilterName,
    onAddPlayer,
    player,
  } = props;
  const [open, toggleOpen] = React.useState(false);

  const [dialogPlayer, setDialogPlayer] = React.useState<PlayerWithInputValue>(
    player || defaultPlayer,
  );

  const handleSubmit = async (player: Player) => {
    toggleOpen(false);
    const newPlayer = await onAddPlayer(player);
    props.setValue(props.name, newPlayer);
    setDialogPlayer(defaultPlayer);
  };

  const handleClose = () => {
    toggleOpen(false);
  };

  const handleCancel = () => {
    if (player?.id === NEW_USER_ID) {
      setDialogPlayer(defaultPlayer);
      props.setValue(props.name, defaultPlayer);
    }
    toggleOpen(false);
  };

  const handleEditPlayer = () => {
    if (player) {
      setDialogPlayer(player!);
      toggleOpen(true);
    }
  };

  const onDeletePlayer = async () => {
    if (!player) {
      return;
    }

    const deletedPlayer = await props.onDeletePlayer(player);
    if (deletedPlayer) {
      props.setValue(props.name, null);
      setDialogPlayer(defaultPlayer);
      toggleOpen(false);
    }
  };

  return (
    <React.Fragment>
      <Controller
        render={({ field }) => (
          <Autocomplete
            {...field}
            fullWidth
            loading={isLoading}
            onInputChange={(event, newInputValue) => {
              setPlayerFilterName(newInputValue);
            }}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                // timeout to avoid instant validation of the dialog's form.
                setTimeout(() => {
                  toggleOpen(true);
                  setDialogPlayer({
                    id: NEW_USER_ID,
                    name: newValue,
                    inputValue: newValue,
                    position: '',
                    team: '',
                    teamid: '',
                    headshot: '',
                  });
                });
              } else if (newValue && newValue.inputValue) {
                const player = {
                  id: NEW_USER_ID,
                  name: newValue.inputValue,
                  position: '',
                  team: '',
                  teamid: '',
                  headshot: '',
                };
                setDialogPlayer(player);
                toggleOpen(true);
                field.onChange(player);
              } else {
                field.onChange(newValue);
              }
            }}
            filterOptions={(player) => player}
            id={props.name}
            options={props.players}
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
              <li {...props}>
                {option.name}
                <span className="text-sm ml-2 text-gray-500">
                  {option.position}
                </span>
              </li>
            )}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label={props.label}
                fullWidth
                error={props.error}
                helperText={props.helperText}
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
                            aria-label="Edit Player"
                            edge="end"
                            size={'small'}
                            onClick={handleEditPlayer}
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
              />
            )}
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
        name={props.name}
        control={props.control}
        defaultValue={''}
      />

      <PlayerDialogForm
        player={dialogPlayer}
        onFormSubmit={handleSubmit}
        handleClose={handleClose}
        handleCancel={handleCancel}
        teams={teams}
        onAddTeam={onAddTeam}
        onDeleteTeam={onDeleteTeam}
        open={open}
        setTeamFilterName={setTeamFilterName}
        teamIsLoading={teamIsLoading}
        onDeletePlayer={onDeletePlayer}
      />
    </React.Fragment>
  );
}
