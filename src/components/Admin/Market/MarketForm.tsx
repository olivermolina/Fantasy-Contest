import React, { useEffect } from 'react';
import {
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { MarketResult, MarketType, Player, Prisma, Team } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TeamWithInputValue } from '../Offer/OfferForm/TeamAutoComplete';
import { MarketWithPlayerTeam } from '~/components/Admin/Market/Markets';
import PlayerAutoComplete, {
  PlayerWithInputValue,
} from '~/components/Admin/Market/PlayerAutoComplete';
import FormControl from '@mui/material/FormControl';

const InputValidationSchema = Yup.object().shape({
  category: Yup.string().trim().required('Category is required'),
  player: Yup.mixed<PlayerWithInputValue>()
    .test(
      'empty-check',
      'Player is required',
      (player) => !(typeof player === 'string') && player?.id !== 'new',
    )
    .required('Player is required'),
  total: Yup.number()
    .typeError('Total is required')
    .required('Total is required'),
});

export const MARKET_STATUS_ENUM = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
};

interface Props {
  handleClose: () => void;
  handleSave: (market: Prisma.MarketCreateInput) => void;
  isLoading: boolean;
  teams: Team[];
  players: Player[];
  market: MarketWithPlayerTeam;
  handleAddTeam: (team: Team) => Promise<Team | undefined>;
  handleDeleteTeam: (team: Team) => Promise<Team | undefined>;
  handleAddPlayer: (player: Player) => Promise<Player | undefined>;
  handleDeletePlayer: (player: Player) => Promise<Player | undefined>;
  playerIsLoading: boolean;
  setPlayerFilterName: React.Dispatch<React.SetStateAction<string>>;
  teamIsLoading: boolean;
  setTeamFilterName: React.Dispatch<React.SetStateAction<string>>;
}

interface MarketInput {
  id: string;
  sel_id: number;
  name: string;
  category: string;
  player: PlayerWithInputValue;
  total?: number;
  total_stat?: number | null;
  status: string;
}

const MarketForm = (props: Props) => {
  const {
    teams,
    market,
    players,
    playerIsLoading,
    setPlayerFilterName,
    teamIsLoading,
    setTeamFilterName,
    handleAddPlayer,
    handleDeletePlayer,
    handleSave,
    handleAddTeam,
    handleDeleteTeam,
  } = props;

  const defaultValues = {
    ...market,
    team: { ...market.team, inputValue: '' },
    player: { ...market.player, inputValue: '' },
    total: market.total || 0,
    total_stat: market.total_stat,
    status: market.active
      ? MARKET_STATUS_ENUM.ACTIVE
      : MARKET_STATUS_ENUM.SUSPENDED,
  };

  const {
    formState: { errors, isDirty },
    setValue,
    handleSubmit,
    control,
    reset,
    register,
    watch,
  } = useForm<MarketInput>({
    resolver: yupResolver(InputValidationSchema),
    defaultValues,
    mode: 'onSubmit',
    shouldFocusError: true,
    shouldUseNativeValidation: false,
  });

  const onSubmit = async (data: MarketInput) => {
    await handleSave({
      id: data.id,
      player: {
        connect: {
          id: data.player?.id,
        },
      },
      sel_id: data.sel_id,
      type: MarketType.PP,
      category: data.category,
      name: data.player.name,
      teamAbbrev: data.player.Team?.code || '',
      offline: false,
      spread_result: MarketResult.Null,
      over_result: MarketResult.Null,
      under_result: MarketResult.Null,
      moneyline_result: MarketResult.Null,
      over: 100,
      under: -145,
      total: data.total,
      total_stat:
        data.total_stat?.toString() === '' ? null : Number(data.total_stat),
      active: data.status === MARKET_STATUS_ENUM.ACTIVE,
    });
  };

  const onAddTeam = async (team: TeamWithInputValue) => {
    return await handleAddTeam(team);
  };

  const onDeleteTeam = async (team: TeamWithInputValue) => {
    return await handleDeleteTeam(team);
  };

  const onAddPlayer = async (player: PlayerWithInputValue) => {
    return await handleAddPlayer(player);
  };

  const onDeletePlayer = async (player: PlayerWithInputValue) => {
    return await handleDeletePlayer(player);
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  const watchPlayer = watch('player');

  useEffect(() => {
    if (market) {
      setTeamFilterName(market.player?.team || '');
      setPlayerFilterName(market.player?.name || '');
      reset({
        ...market,
        player: { ...market.player, inputValue: '' },
        total: market.total || 0,
        total_stat: market.total_stat || null,
        status: market.active
          ? MARKET_STATUS_ENUM.ACTIVE
          : MARKET_STATUS_ENUM.SUSPENDED,
      });
    }
  }, [market]);

  return (
    <Paper sx={{ m: 2 }}>
      <h3 className={'text-md pl-4 pt-2'}>
        Market ID: <span className="font-bold">{props.market?.id}</span>
      </h3>
      <form id={'marketForm'} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={6}>
            <PlayerAutoComplete
              players={players}
              teams={teams}
              label={'Select Player'}
              name={'player'}
              control={control}
              error={!!errors?.player}
              helperText={errors?.player?.message}
              setValue={setValue}
              onAddTeam={onAddTeam}
              onDeleteTeam={onDeleteTeam}
              onAddPlayer={onAddPlayer}
              onDeletePlayer={onDeletePlayer}
              isLoading={playerIsLoading}
              setPlayerFilterName={setPlayerFilterName}
              teamIsLoading={teamIsLoading}
              setTeamFilterName={setTeamFilterName}
              player={watchPlayer as PlayerWithInputValue}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Category"
              variant="outlined"
              fullWidth
              {...register('category')}
              error={!!errors?.category}
              helperText={errors?.category?.message}
              size={'small'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type={'number'}
              label="Total"
              variant="outlined"
              fullWidth
              {...register('total')}
              error={!!errors?.total}
              helperText={errors?.total?.message}
              size={'small'}
              inputProps={{
                step: 0.01,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type={'number'}
              label="Total Result"
              variant="outlined"
              fullWidth
              {...register('total_stat')}
              error={!!errors?.total_stat}
              helperText={errors?.total_stat?.message}
              size={'small'}
              inputProps={{
                step: 0.01,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="status"
              control={control}
              defaultValue={MARKET_STATUS_ENUM.ACTIVE}
              render={({ field }) => (
                <FormControl fullWidth size={'small'}>
                  <Select size={'small'} fullWidth {...field}>
                    <MenuItem key={'empty-status'} value={undefined} disabled>
                      <em>Select status</em>
                    </MenuItem>
                    {Object.keys(MARKET_STATUS_ENUM).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
            >
              <Button
                type={'submit'}
                variant={'outlined'}
                size={'large'}
                disabled={props.isLoading || !isDirty}
              >
                Save & Close
                {props.isLoading && (
                  <CircularProgress sx={{ ml: 1 }} size={20} />
                )}
              </Button>
              <Button
                onClick={handleReset}
                size={'large'}
                disabled={props.isLoading || !isDirty}
              >
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default MarketForm;
