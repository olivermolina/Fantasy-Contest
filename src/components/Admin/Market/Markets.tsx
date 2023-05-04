import * as React from 'react';
import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  AccordionDetails,
  Button,
  Dialog,
  IconButton,
  Tooltip,
} from '@mui/material';
import CustomDataTable from '~/components/CustomDataTable';
import { ColumnDef } from '@tanstack/react-table';
import {
  Market,
  MarketResult,
  MarketType,
  Offer,
  Player,
  Prisma,
  Team,
} from '@prisma/client';
import CloseIcon from '@mui/icons-material/Close';
import MarketForm from '~/components/Admin/Market/MarketForm';
import { PlayerWithInputValue } from '~/components/Admin/Market/PlayerAutoComplete';
import dayjs from 'dayjs';
import MarketDeleteDialog from '~/components/Admin/Market/MarketDeleteDialog';

interface PropsMarket {
  isLoading: boolean;
  flatData: Market[];
  totalDBRowCount: number;
  totalFetched: number;
  isFetching: boolean;
  fetchNextPage: any;
  offer?: Offer;
  teams: Team[];
  handleAddTeam: (team: Team) => Promise<Team | undefined>;
  players: Player[];
  playerIsLoading: boolean;
  setPlayerFilterName: React.Dispatch<React.SetStateAction<string>>;
  teamIsLoading: boolean;
  setTeamFilterName: React.Dispatch<React.SetStateAction<string>>;
  handleAddPlayer: (player: Player) => Promise<Player | undefined>;
  handleSave: (
    market: Prisma.MarketCreateInput,
  ) => Promise<MarketWithPlayerTeam | undefined>;
  handleDelete: (market: Market) => void;
}

export type MarketWithPlayerTeam = Market & {
  team: Team | null;
  player: Player | null;
};

export default function Markets(props: PropsMarket) {
  const {
    handleAddTeam,
    teams,
    players,
    playerIsLoading,
    setPlayerFilterName,
    teamIsLoading,
    setTeamFilterName,
    handleAddPlayer,
    isLoading,
    handleDelete,
  } = props;
  const newMarket = {
    id: 'new',
    sel_id: dayjs().unix(),
    type: MarketType.PP,
    category: '',
    name: '',
    teamAbbrev: '',
    offline: false,
    spread: null,
    spread_odd: null,
    total: null,
    over: null,
    under: null,
    moneyline: null,
    spread_bet: null,
    spread_cash: null,
    over_bet: null,
    under_bet: null,
    over_cash: null,
    under_cash: null,
    moneyline_bet: null,
    moneyline_cash: null,
    spread_result: MarketResult.Null,
    spread_stat: null,
    over_result: MarketResult.Null,
    under_result: MarketResult.Null,
    total_stat: null,
    moneyline_result: MarketResult.Null,
    moneyline_stat: null,
    offerId: props.offer?.gid || '',
    teamId: null,
    playerId: null,
    player: {
      id: 'new',
      name: '',
      position: '',
      team: '',
      teamid: '',
      headshot: '',
    },
    created_at: new Date(),
    updated_at: new Date(),
    team: null,
    freeSquareId: null,
  };
  const [selectedMarket, setSelectedMarket] =
    useState<MarketWithPlayerTeam>(newMarket);

  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const columns = React.useMemo<ColumnDef<MarketWithPlayerTeam>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
      },
      {
        accessorFn: (row) => row.player,
        id: 'player',
        cell: (info) => (info.getValue() as Player)?.name,
        header: () => <span>Player Name</span>,
      },
      {
        accessorFn: (row) => row.player,
        id: 'player',
        cell: (info) => (info.getValue() as PlayerWithInputValue)?.Team?.name,
        header: () => <span>Player Team</span>,
      },
      {
        accessorFn: (row) => row.category,
        id: 'category',
        cell: (info) => info.getValue(),
        header: () => <span>Category</span>,
      },
      {
        accessorFn: (row) => row.total,
        id: 'total',
        cell: (info) => info.getValue(),
        header: () => <span>Total</span>,
      },
      {
        accessorFn: (row) => row.total_stat,
        id: 'total_stat',
        cell: (info) => info.getValue(),
        header: () => <span>Total Result</span>,
      },
      {
        header: 'Action',
        cell: (info) => (
          <>
            <Button
              variant={'outlined'}
              onClick={() => {
                setSelectedMarket(info.row.original);
                handleOpen();
              }}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant={'outlined'}
              color={'secondary'}
              onClick={() => {
                setSelectedMarket(info.row.original);
                setOpenDeleteDialog(true);
              }}
            >
              Remove
            </Button>
          </>
        ),
      },
    ],
    [],
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleNew = () => {
    setSelectedMarket(newMarket);
    handleOpen();
  };

  const handleSave = async (marketInput: Prisma.MarketCreateInput) => {
    const market = await props.handleSave({
      ...marketInput,
      offer: {
        connect: {
          gid: props.offer?.gid || '',
        },
      },
    });
    if (market) setSelectedMarket(market);
  };

  const isNewOffer = !props.offer || props.offer?.gid === 'NEW';

  return (
    <>
      <Tooltip
        title={
          props.offer && props.offer.gid !== 'NEW'
            ? null
            : 'Save new offer to add market.'
        }
      >
        <Accordion disabled={isNewOffer} expanded={!isNewOffer}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h3 className="font-bold text-lg">Markets</h3>
          </AccordionSummary>
          <AccordionDetails>
            <CustomDataTable
              {...props}
              tableTitle={'Markets'}
              searchPlaceholder={'Search market'}
              columns={columns}
              handleNew={handleNew}
            />
          </AccordionDetails>
        </Accordion>
      </Tooltip>

      <Dialog open={open} maxWidth={'lg'} fullWidth>
        <div
          className={
            'flex flex-row justify-between items-center bg-blue-600 p-4'
          }
        >
          <h2 className={'text-2xl font-bold text-white'}>
            {selectedMarket.id !== 'new' ? 'Update' : 'Add'} Market
          </h2>

          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 5,
              top: 5,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className={'flex flex-col'}>
          <MarketForm
            handleClose={handleClose}
            handleSave={handleSave}
            isLoading={isLoading}
            teams={teams}
            setTeamFilterName={setTeamFilterName}
            teamIsLoading={teamIsLoading}
            handleAddTeam={handleAddTeam}
            market={selectedMarket}
            players={players}
            handleAddPlayer={handleAddPlayer}
            playerIsLoading={playerIsLoading}
            setPlayerFilterName={setPlayerFilterName}
          />
        </div>
      </Dialog>
      <MarketDeleteDialog
        market={selectedMarket}
        open={openDeleteDialog}
        handleDelete={handleDelete}
        setOpen={setOpenDeleteDialog}
      />
    </>
  );
}
