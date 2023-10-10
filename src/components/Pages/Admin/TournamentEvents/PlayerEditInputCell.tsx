import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import PlayerAutoComplete, {
  PlayerWithInputValue,
} from '~/components/Admin/Market/PlayerAutoComplete';
import * as z from 'zod';

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
});

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  teamid: z.string(),
  team: z.string(),
  headshot: z.string().nullable(),
  Team: TeamSchema.optional().nullable(),
});

export const PlayerWithInputValueSchema = PlayerSchema.and(
  z.object({
    Team: TeamSchema.optional().nullable(),
    inputValue: z.string().optional(),
  }),
);

export const PlayerInputSchema = z.object({
  player: PlayerWithInputValueSchema,
});

export type PlayerInput = z.infer<typeof PlayerInputSchema>;

export default function PlayerEditInputCell(
  props: GridRenderEditCellParams & {
    players: any;
    teams: any;
    playerIsLoading: boolean;
    teamIsLoading: boolean;
    handleAddPlayer: any;
    handleAddTeam: any;
    handleDeleteTeam: any;
    setPlayerFilterName: any;
    setTeamFilterName: any;
    handleDeletePlayer: any;
  },
) {
  const {
    id,
    value,
    field,
    players,
    teams,
    playerIsLoading,
    teamIsLoading,
    handleAddTeam,
    handleDeleteTeam,
    handleAddPlayer,
    handleDeletePlayer,
    setPlayerFilterName,
    setTeamFilterName,
  } = props;
  const apiRef = useGridApiContext();

  const {
    formState: { errors },
    setValue,
    control,
    handleSubmit,
    watch,
  } = useForm<PlayerInput>({
    resolver: zodResolver(PlayerSchema),
    defaultValues: { player: value },
    mode: 'onSubmit',
    shouldFocusError: true,
    shouldUseNativeValidation: false,
  });

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  const watchPlayer = watch('player');

  useEffect(() => {
    apiRef.current.setEditCellValue({ id, field, value: watchPlayer });
  }, [watchPlayer]);
  return (
    <div className={'w-full'}>
      <form id={'marketPlayerForm'} onSubmit={handleSubmit(onSubmit)}>
        <PlayerAutoComplete
          players={players || []}
          teams={teams || []}
          label={''}
          name={'player'}
          control={control}
          error={!!errors?.player}
          helperText={errors?.player?.message}
          setValue={setValue}
          onAddTeam={handleAddTeam}
          onDeleteTeam={handleDeleteTeam}
          onAddPlayer={handleAddPlayer}
          onDeletePlayer={handleDeletePlayer}
          isLoading={playerIsLoading}
          setPlayerFilterName={setPlayerFilterName}
          teamIsLoading={teamIsLoading}
          setTeamFilterName={setTeamFilterName}
          noBorder={true}
          player={value as PlayerWithInputValue}
        />
      </form>
    </div>
  );
}
