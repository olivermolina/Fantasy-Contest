import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
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
import { Team, Player } from '@prisma/client';

import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';

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
    teams,
    onFormSubmit,
    handleCancel,
    teamIsLoading,
    setTeamFilterName,
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
      id: 'NEW',
      name: player.name,
      position: player.position,
      team: player?.Team?.name || '',
      teamid: player?.Team?.id || '',
      headshot: player.headshot,
    });
  };

  useEffect(() => {
    if (player) {
      reset(player);
    }
  }, [player]);

  return (
    <Dialog open={open}>
      <form id="playerDialogForm">
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Add a new player</Box>
            <Box>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Did you miss any player in our list? Please, add it!
          </DialogContentText>
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
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={() => handleSubmit(onSubmit)()}>Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PlayerDialogForm;
