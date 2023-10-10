import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PlayerWithInputValue } from '~/components/Admin/Market/PlayerAutoComplete';
import * as Yup from 'yup';
import TeamAutoComplete, {
  TeamWithInputValue,
} from '~/components/Admin/Offer/OfferForm/TeamAutoComplete';
import { Player, Team } from '@prisma/client';

import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import { NEW_USER_ID } from '~/constants/NewUserId';

const InputValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required'),
  position: Yup.string().trim().required('Name is required'),
  Team: Yup.mixed<TeamWithInputValue>()
    .test(
      'empty-check',
      'Home team is required',
      (team) => !(typeof team === 'string'),
    )
    .required('Away team is required'),
  headshot: Yup.string().trim().required('Player headshot is required'),
});

interface PlayerDialogFormProps {
  player: PlayerWithInputValue;
  open: boolean;
  handleClose: () => void;
  handleCancel: () => void;
  onAddTeam: (team: Team) => Promise<Team | undefined>;
  onDeleteTeam: (team: Team) => Promise<Team | undefined>;
  onDeletePlayer: () => void;
  teams: Team[];
  onFormSubmit: (player: Player) => void;
  teamIsLoading: boolean;
  setTeamFilterName: React.Dispatch<React.SetStateAction<string>>;
}

const PlayerDialogForm = (props: PlayerDialogFormProps) => {
  const {
    open,
    handleClose,
    player,
    onAddTeam,
    onDeleteTeam,
    teams,
    onFormSubmit,
    handleCancel,
    teamIsLoading,
    setTeamFilterName,
    onDeletePlayer,
  } = props;

  const defaultValues = {
    ...player,
  };

  const {
    formState: { errors },
    handleSubmit,
    control,
    register,
    setValue,
    reset,
  } = useForm<PlayerWithInputValue>({
    resolver: yupResolver(InputValidationSchema),
    defaultValues,
    mode: 'onSubmit',
    shouldFocusError: true,
    shouldUseNativeValidation: false,
  });

  const onSubmit = async (player: PlayerWithInputValue) => {
    await onFormSubmit({
      id: player.id || NEW_USER_ID,
      name: player.name,
      position: player.position,
      team: player?.Team?.name || '',
      teamid: player?.Team?.id || '',
      headshot: player.headshot,
    });
  };

  const handleSubmitWithoutPropagation = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    handleSubmit(onSubmit)(event);
  };

  useEffect(() => {
    if (player) {
      reset(player);
    }
  }, [player]);

  return (
    <Dialog open={open}>
      <form id="playerDialogForm" onSubmit={handleSubmitWithoutPropagation}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>
              {player.id === 'NEW' ? 'New' : 'Edit'} Player
            </Box>
            <Box>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            variant="outlined"
            {...register('name')}
            error={!!errors?.name}
            helperText={errors?.name?.message}
            fullWidth
            size={'small'}
            sx={{ mb: 2 }}
          />
          <TeamAutoComplete
            teams={teams}
            label={'Select Team'}
            name={'Team'}
            control={control}
            error={!!errors?.team}
            helperText={errors?.team?.message}
            setValue={setValue}
            onAddTeam={onAddTeam}
            onDeleteTeam={onDeleteTeam}
            isLoading={teamIsLoading}
            setTeamFilterName={setTeamFilterName}
          />
          <TextField
            margin="dense"
            id="position"
            label="Position"
            type="text"
            variant="outlined"
            {...register('position')}
            error={!!errors?.position}
            helperText={errors?.position?.message}
            fullWidth
            size={'small'}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            id="headshot"
            label="Player headshot"
            type="text"
            variant="outlined"
            {...register('headshot')}
            error={!!errors?.headshot}
            helperText={errors?.headshot?.message}
            fullWidth
            size={'small'}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          {player.id !== NEW_USER_ID ? (
            <Button
              onClick={onDeletePlayer}
              className={'underline text-blue-500'}
            >
              Delete this Player
            </Button>
          ) : (
            <span />
          )}
          <div className={'space-x-2'}>
            <Button type="submit" variant={'contained'}>
              Save
            </Button>
            <Button onClick={handleCancel} variant={'outlined'}>
              Cancel
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PlayerDialogForm;
