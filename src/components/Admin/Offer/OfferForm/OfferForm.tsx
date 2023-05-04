import React, { useEffect } from 'react';
import {
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { League, Offer, Prisma, Status, Team } from '@prisma/client';
import dayjs, { Dayjs } from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import {
  LeagueEnum,
  mapPrismaLeagueToLeagueEnum,
} from '~/lib/ev-analytics/EVAnaltyics';
import { MobileTimePicker } from '@mui/x-date-pickers';
import TeamAutoComplete, { TeamWithInputValue } from './TeamAutoComplete';

export const mapLeagueEnumToPrismaLeague = (league: LeagueEnum): League => {
  switch (league) {
    case LeagueEnum.NFL:
      return League.NFL;
    case LeagueEnum.MLB:
      return League.MLB;
    case LeagueEnum.NBA:
      return League.NBA;
    case LeagueEnum.NCAAB:
      return League.NCAAB;
    case LeagueEnum.NCAAF:
      return League.NCAAF;
    case LeagueEnum.NHL:
      return League.NHL;
    case LeagueEnum.TENNIS:
      return League.TENNIS;
    case LeagueEnum.GOLF:
      return League.GOLF;
    case LeagueEnum.SOCCER:
      return League.SOCCER;
    case LeagueEnum.MMA:
      return League.MMA;
    default:
      return League.NFL;
  }
};

const InputValidationSchema = Yup.object().shape({
  league: Yup.mixed<LeagueEnum>()
    .oneOf(Object.values(LeagueEnum), 'League is required')
    .required('League is required'),
  gamedate: Yup.string().trim().required('Game date is required'),
  gametime: Yup.string().trim().required('Game time is required '),
  status: Yup.string().trim().required('Game status is required'),
  homeTeam: Yup.mixed<TeamWithInputValue>()
    .test(
      'empty-check',
      'Home team is required',
      (team) => !(typeof team === 'string'),
    )
    .required('Home team is required'),
  awayTeam: Yup.mixed<TeamWithInputValue>()
    .test(
      'empty-check',
      'Home team is required',
      (team) => !(typeof team === 'string'),
    )
    .required('Away team is required'),
});

export type OfferWithTeams = Offer & {
  home: Team | null;
  away: Team | null;
};

interface Props {
  handleClose: () => void;
  handleSave: (offer: Prisma.OfferCreateInput) => void;
  isLoading: boolean;
  mutationError?: any;
  offer?: OfferWithTeams | null;
  handleAddTeam: (team: Team) => Promise<Team | undefined>;
  homeTeams: Team[];
  awayTeams: Team[];
  homeTeamSetFilterName: React.Dispatch<React.SetStateAction<string>>;
  awayTeamSetFilterName: React.Dispatch<React.SetStateAction<string>>;
  homeTeamIsLoading: boolean;
  awayTeamIsLoading: boolean;
}

interface OfferInput {
  id: string;
  league: LeagueEnum | string;
  gamedate: Dayjs;
  gametime: Dayjs;
  status: Status | string;
  homeTeam: TeamWithInputValue | null;
  awayTeam: TeamWithInputValue | null;
}

const mapGameStatusLabel = (status: Status) => {
  switch (status) {
    case Status.Scheduled:
      return 'Scheduled';
    case Status.InProgress:
      return 'In-progress';
    case Status.Final:
      return 'Final';
    case Status.PostponedCanceled:
      return 'Postponed / Canceled';
    default:
      return 'Others';
  }
};

const OfferForm = (props: Props) => {
  const {
    offer,
    homeTeams,
    homeTeamSetFilterName,
    homeTeamIsLoading,
    awayTeams,
    awayTeamSetFilterName,
    awayTeamIsLoading,
  } = props;

  const defaultValues = {
    id: offer?.gid,
    league: mapPrismaLeagueToLeagueEnum(offer?.league),
    status: offer?.status,
    gamedate: dayjs(`${offer?.gamedate} ${offer?.gametime}`),
    gametime: dayjs(`${offer?.gamedate} ${offer?.gametime}`),
    homeTeam: offer?.home,
    awayTeam: offer?.away,
  };

  const {
    formState: { errors, isDirty },
    setValue,
    handleSubmit,
    control,
    reset,
  } = useForm<OfferInput>({
    resolver: yupResolver(InputValidationSchema),
    defaultValues,
    mode: 'onSubmit',
    shouldFocusError: true,
    shouldUseNativeValidation: false,
  });

  const onSubmit = async (data: OfferInput) => {
    const formattedGameDate = dayjs(data.gamedate).format('YYYY-MM-DD');
    const formattedGameTime = dayjs(data.gametime).format('hh:mm:ss A');
    const league = mapLeagueEnumToPrismaLeague(data?.league as LeagueEnum);
    await props.handleSave({
      gid: data.id,
      league,
      gamedate: formattedGameDate,
      gametime: formattedGameTime,
      epoch: dayjs(`${formattedGameDate} ${formattedGameTime}`).unix(),
      status: data.status as Status,
      matchup: `${data.awayTeam?.code} @ ${data.homeTeam?.code}`,
      manualEntry: true,
      home: {
        connect: {
          id: data.homeTeam?.id,
        },
      },
      away: {
        connect: {
          id: data.awayTeam?.id,
        },
      },
      inplay: false,
    });
  };

  const onAddTeam = async (team: TeamWithInputValue) => {
    return await props.handleAddTeam(team);
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  useEffect(() => {
    if (offer) {
      awayTeamSetFilterName(offer.away?.name || '');
      homeTeamSetFilterName(offer.home?.name || '');

      reset({
        id: offer.gid,
        league: mapPrismaLeagueToLeagueEnum(offer.league),
        status: offer.status,
        gamedate: dayjs(`${offer.gamedate} ${offer.gametime}`),
        gametime: dayjs(`${offer.gamedate} ${offer.gametime}`),
        homeTeam: offer.home,
        awayTeam: offer.away,
      });
    }
  }, [offer]);

  return (
    <Paper sx={{ m: 2 }}>
      <h3 className={'text-md pl-4 pt-2'}>
        Offer ID: <span className="font-bold">{props.offer?.gid || 'New'}</span>
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} id={'offerForm'}>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={6}>
            <Controller
              control={control}
              name={'league'}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id="league"
                  select
                  label="Select league"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  size={'small'}
                  onChange={(event) => field.onChange(event.target.value)}
                  value={field.value}
                >
                  <MenuItem key={'empty-league'} value={undefined}>
                    <span className={'italic text-gray-400'}>
                      Select league
                    </span>
                  </MenuItem>
                  {Object.values(LeagueEnum).map((value: LeagueEnum) => (
                    <MenuItem key={value} value={value}>
                      {value.toUpperCase()}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              defaultValue={''}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name={'status'}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id="status"
                  select
                  label="Select Status"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  size={'small'}
                  onChange={(event) => field.onChange(event.target.value)}
                  value={field.value}
                >
                  <MenuItem key={'empty-status'} value={undefined}>
                    <span className={'italic text-gray-400'}>
                      Select status
                    </span>
                  </MenuItem>
                  {Object.values(Status).map((value) => (
                    <MenuItem key={value} value={value}>
                      {mapGameStatusLabel(value)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              defaultValue={''}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              control={control}
              name={'gamedate'}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    label="Game Date"
                    inputFormat="YYYY-MM-DD"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                        size={'small'}
                        value={field.value}
                      />
                    )}
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              control={control}
              name={'gametime'}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    label="Game Time"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                        size={'small'}
                        value={field.value}
                        inputProps={{
                          'data-testid': 'gametime',
                          ...params.inputProps,
                        }}
                      />
                    )}
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <TeamAutoComplete
              teams={homeTeams}
              label={'Select Home Team'}
              name={'homeTeam'}
              control={control}
              error={!!errors?.homeTeam}
              helperText={errors?.homeTeam?.message}
              setValue={setValue}
              onAddTeam={onAddTeam}
              setTeamFilterName={homeTeamSetFilterName}
              isLoading={homeTeamIsLoading}
            />
          </Grid>
          <Grid item xs={6}>
            <TeamAutoComplete
              teams={awayTeams}
              label={'Select Away Team'}
              name={'awayTeam'}
              control={control}
              error={!!errors?.awayTeam}
              helperText={errors?.awayTeam?.message}
              setValue={setValue}
              onAddTeam={onAddTeam}
              setTeamFilterName={awayTeamSetFilterName}
              isLoading={awayTeamIsLoading}
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
                Save
                {props.isLoading && (
                  <CircularProgress sx={{ ml: 1 }} size={20} />
                )}
              </Button>
              <Button
                onClick={handleReset}
                size={'large'}
                disabled={props.isLoading || !isDirty}
              >
                Cancel
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default OfferForm;
