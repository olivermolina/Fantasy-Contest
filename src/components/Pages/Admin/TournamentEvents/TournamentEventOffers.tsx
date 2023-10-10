import React, { useEffect } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  MuiEvent,
} from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Button, Dialog, IconButton, LinearProgress } from '@mui/material';
import CustomNoEventsOverlay from '~/components/Pages/Admin/TournamentEvents/CustomNoEventsOverlay';
import { randomId } from '@mui/x-data-grid-generator';
import { League, Offer, Player, Status, Team } from '@prisma/client';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { TournamentEventOfferInput } from '~/schemas/TournamentEventOffersSchema';
import { mapGameStatusLabel } from '~/components/Admin/Offer/OfferForm/OfferForm';
import { MarketWithPlayerTeam } from '~/components/Admin/Market/Markets';
import {
  DateTimeColumnType,
  TournamentEventWithOfferMarkets,
} from '~/components/Pages/Admin/TournamentEvents/TournamentEvents';
import dayjs from 'dayjs';
import PlayerEditInputCell from './PlayerEditInputCell';
import TeamEditInputCell from './TeamEditInputCell';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const ActiveSuspendedStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
};

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
  league: League;
  gamedate: Date;
  tournamentEventId: string;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, league, tournamentEventId } = props;

  const handleNew = () => {
    const id = randomId();
    const marketId = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        marketId,
        sel_id: dayjs().unix(),
        tournamentEventId,
        gameDatetime: new Date(),
        league,
        status: Status.Scheduled,
        active: ActiveSuspendedStatus.ACTIVE,
        isNew: true,
        total: 0,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <div className={'flex flex-col gap-2 p-2'}>
      <GridToolbarContainer>
        <GridToolbarQuickFilter />
        <IconButton onClick={handleNew} color="primary">
          <AddIcon />
        </IconButton>
      </GridToolbarContainer>
    </div>
  );
}

interface Props {
  tournamentEvent: TournamentEventWithOfferMarkets;
  handleSaveTournamentEventOffer: (data: TournamentEventOfferInput) => void;
  handleDeleteTournamentEventOffer: (id: string, league: League) => any;
  isLoading: boolean;
  teams: Team[];
  players: Player[];
  setPlayerFilterName: React.Dispatch<React.SetStateAction<string>>;
  playerIsLoading: boolean;
  setTeamFilterName: React.Dispatch<React.SetStateAction<string>>;
  teamIsLoading: boolean;
  handleAddTeam: (team: Team) => Promise<Team | undefined>;
  handleDeleteTeam: (team: Team) => Promise<Team | undefined>;
  handleAddPlayer: (player: Player) => Promise<Player | undefined>;
  handleDeletePlayer: (player: Player) => Promise<Player | undefined>;
}

const TournamentEventOffers = (props: Props) => {
  const {
    tournamentEvent,
    isLoading,
    handleSaveTournamentEventOffer,
    handleDeleteTournamentEventOffer,
    teams,
    players,
    setPlayerFilterName,
    setTeamFilterName,
    playerIsLoading,
    teamIsLoading,
    handleAddTeam,
    handleDeleteTeam,
    handleAddPlayer,
    handleDeletePlayer,
  } = props;
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [selectedRowId, setSelectedRowId] = React.useState<GridRowId | null>(
    null,
  );

  const noButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setSelectedRowId(id);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = {
      ...newRow,
      isNew: false,
    };

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    const gameDateTimeFormatted = dayjs(newRow.gameDateTime).format(
      'YYYY-MM-DD HH:mm',
    );

    if (newRow.player?.id && newRow.awayTeam?.id) {
      handleSaveTournamentEventOffer({
        id: newRow.id,
        tournamentEventId: newRow.tournamentEventId,
        marketId: newRow.marketId,
        sel_id: newRow.sel_id,
        league: newRow.league,
        status: newRow.status,
        gameDateTime: dayjs
          .tz(gameDateTimeFormatted, 'America/New_York')
          .toDate(),
        category: newRow.category,
        player: {
          id: newRow.player.id,
          name: newRow.player.name,
          teamId: newRow.player.Team.id,
          teamCode: newRow.player.Team.code,
          teamName: newRow.player.Team.name,
        },
        awayTeamId: newRow.awayTeam.id,
        homeTeamId: newRow.homeTeam.id,
        total: newRow.total,
        total_stat: newRow.total_stat,
        active: newRow.active === ActiveSuspendedStatus.ACTIVE,
        matchup: newRow.homeTeam.code + ' @ ' + newRow.awayTeam.code,
      } as TournamentEventOfferInput);
    }

    return updatedRow;
  };

  const handleProcessRowUpdateError = (error: any) => {
    console.error('Error updating row', error);
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      flex: 1,
      headerName: 'ID',
    },
    {
      field: 'status',
      flex: 1,
      headerName: 'Game Status',
      type: 'singleSelect',
      valueOptions: Object.keys(Status),
      getOptionLabel: (option: any) => mapGameStatusLabel(option as Status),
      editable: true,
    },
    {
      field: 'gameDateTime',
      ...DateTimeColumnType,
      flex: 1,
      headerName: 'Game DateTime',
      editable: true,
      minWidth: 200,
    },
    {
      field: 'player',
      flex: 1,
      headerName: 'Player',
      editable: true,
      minWidth: 150,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        return {
          ...params.props,
          error: !params.props.value ? 'Please select player' : null,
        };
      },
      renderEditCell: (params: GridRenderEditCellParams) => (
        <PlayerEditInputCell
          {...params}
          teams={teams}
          players={players}
          setPlayerFilterName={setPlayerFilterName}
          setTeamFilterName={setTeamFilterName}
          playerIsLoading={playerIsLoading}
          teamIsLoading={teamIsLoading}
          handleAddTeam={handleAddTeam}
          handleDeleteTeam={handleDeleteTeam}
          handleAddPlayer={handleAddPlayer}
          handleDeletePlayer={handleDeletePlayer}
        />
      ),
      renderCell: (params) => {
        const currentRow = params.row as (typeof rows)[0];
        return currentRow.player?.name;
      },
    },
    {
      field: 'homeTeam',
      flex: 1,
      headerName: 'Home Team',
      editable: true,
      minWidth: 150,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        return {
          ...params.props,
          error: !params.props.value ? 'Please select home team' : null,
        };
      },
      renderCell: (params) => {
        const currentRow = params.row as (typeof rows)[0];
        return currentRow.homeTeam?.name;
      },
      renderEditCell: (params: GridRenderEditCellParams) => (
        <TeamEditInputCell
          {...params}
          teams={teams}
          setTeamFilterName={setTeamFilterName}
          teamIsLoading={teamIsLoading}
          handleAddTeam={handleAddTeam}
          handleDeleteTeam={handleDeleteTeam}
        />
      ),
    },
    {
      field: 'awayTeam',
      flex: 1,
      headerName: 'Away Team',
      editable: true,
      minWidth: 150,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        return {
          ...params.props,
          error: !params.props.value ? 'Please select away team' : null,
        };
      },
      renderCell: (params) => {
        const currentRow = params.row as (typeof rows)[0];
        return currentRow.awayTeam?.name;
      },
      renderEditCell: (params: GridRenderEditCellParams) => (
        <TeamEditInputCell
          {...params}
          teams={teams}
          setTeamFilterName={setTeamFilterName}
          teamIsLoading={teamIsLoading}
          handleAddTeam={handleAddTeam}
          handleDeleteTeam={handleDeleteTeam}
        />
      ),
    },
    {
      field: 'category',
      flex: 1,
      headerName: 'Category',
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        return {
          ...params.props,
          error: !params.props.value ? 'Please enter category' : null,
        };
      },
    },
    {
      field: 'total',
      flex: 1,
      headerName: 'Proj Stat',
      editable: true,
    },
    {
      field: 'total_stat',
      flex: 1,
      headerName: 'Final Stat',
      editable: true,
    },
    {
      field: 'active',
      flex: 1,
      headerName: 'Offer Status',
      editable: true,
      type: 'singleSelect',
      valueOptions: Object.keys(ActiveSuspendedStatus),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`save-${id}`}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`cancel-${id}`}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={`edit-${id}`}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`delete-${id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };

  const handleYes = async () => {
    const selectedRow = rows.find((row) => row.id === selectedRowId);
    const result = await handleDeleteTournamentEventOffer(
      selectedRowId as string,
      selectedRow?.league as League,
    );
    if (result) {
      setRows(rows.filter((row) => row.id !== selectedRowId));
    }
    setSelectedRowId(null);
  };

  const handleClose = () => {
    setSelectedRowId(null);
  };

  useEffect(() => {
    if (tournamentEvent) {
      const tableRows = tournamentEvent.Offers?.reduce(
        (
          acc: any,
          offer: Offer & {
            markets: MarketWithPlayerTeam[];
            home: Team;
            away: Team;
          },
        ) => {
          return [
            ...acc,
            ...(offer.markets as MarketWithPlayerTeam[]).map((market) => ({
              id: offer.gid,
              tournamentEventId: tournamentEvent.id,
              matchup: offer.matchup,
              league: offer.league,
              status: offer.status,
              gameDateTime: dayjs
                .tz(`${offer.gamedate} ${offer.gametime}`, 'America/New_York')
                .toDate(),
              marketId: market.id,
              sel_id: market.sel_id,
              category: market.category,
              player: market.player,
              total: market.total,
              total_stat: market.total_stat,
              active: market.active
                ? ActiveSuspendedStatus.ACTIVE
                : ActiveSuspendedStatus.SUSPENDED,
              homeTeam: offer.home,
              awayTeam: offer.away,
            })),
          ];
        },
        [],
      );
      if (tableRows && tableRows.length > 0) {
        setRows(tableRows);
      }
    }
  }, [tournamentEvent]);

  return (
    <>
      <div style={{ height: '100%', width: '100%' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DataGrid
            slots={{
              noRowsOverlay: CustomNoEventsOverlay,
              loadingOverlay: LinearProgress,
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: {
                setRows,
                setRowModesModel,
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                tournamentEventId: tournamentEvent.id,
                league: tournamentEvent.league,
                gamedate: tournamentEvent.created_at,
              },
            }}
            rows={rows}
            getRowId={(row) => row.id}
            loading={isLoading}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            onRowModesModelChange={handleRowModesModelChange}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
          />
        </LocalizationProvider>
      </div>

      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={selectedRowId !== null}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          <p>{`Pressing 'Yes' will remove the offer.`}</p>
          <p>
            Player:{' '}
            <span className={'font-semibold'}>
              {rows?.find((row) => row.id === selectedRowId)?.player?.name}
            </span>
          </p>
          <p>
            Category:{' '}
            <span className={'font-semibold'}>
              {rows?.find((row) => row.id === selectedRowId)?.category}
            </span>
          </p>
          <p>
            Proj Stat:{' '}
            <span className={'font-semibold'}>
              {rows?.find((row) => row.id === selectedRowId)?.total}
            </span>
          </p>
        </DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleClose} variant={'outlined'}>
            No
          </Button>
          <Button onClick={handleYes} variant={'contained'}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TournamentEventOffers;
