import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Player, Team } from '@prisma/client';
import { Controller } from 'react-hook-form';
import PlayerDialogForm from '~/components/Admin/Market/PlayerDialogForm';
import CircularProgress from '@mui/material/CircularProgress';

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
  onAddPlayer: (player: Player) => Promise<Player | undefined>;
  teams: Team[];
  isLoading: boolean;
  setPlayerFilterName: React.Dispatch<React.SetStateAction<string>>;
  teamIsLoading: boolean;
  setTeamFilterName: React.Dispatch<React.SetStateAction<string>>;
}

export default function PlayerAutoComplete(props: Props) {
  const {
    teams,
    onAddTeam,
    isLoading,
    setPlayerFilterName,
    teamIsLoading,
    setTeamFilterName,
    onAddPlayer,
  } = props;
  const [open, toggleOpen] = React.useState(false);

  const defaultPlayer = {
    id: 'NEW',
    name: '',
    position: '',
    team: '',
    teamid: '',
    headshot: '',
  };

  const [dialogPlayer, setDialogPlayer] =
    React.useState<PlayerWithInputValue>(defaultPlayer);

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
    setDialogPlayer(defaultPlayer);
    toggleOpen(false);
    props.setValue(props.name, defaultPlayer);
  };

  return (
    <React.Fragment>
      <Controller
        render={({ field }) => (
          <Autocomplete
            {...field}
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
                    id: 'new',
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
                  id: 'new',
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
        open={open}
        setTeamFilterName={setTeamFilterName}
        teamIsLoading={teamIsLoading}
      />
    </React.Fragment>
  );
}
