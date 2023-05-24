import React, { useMemo, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { DataGrid } from '@mui/x-data-grid';
import { MORE_OR_LESS_CONTEST_ID } from '~/constants/MoreOrLessContestId';
import { ContestType, League } from '@prisma/client';
import { MenuItem, TextField } from '@mui/material';
import BackdropLoading from '~/components/BackdropLoading';
import { TruncateCellContent } from '~/components/Pages/Admin/LineExposure/LineExposure';

export default function ListOffersContainer() {
  const [selectedLeague, setSelectedLeague] = useState<League>(League.NBA);
  const { isLoading, data } = trpc.contest.listOffers.useQuery(
    {
      contestId: MORE_OR_LESS_CONTEST_ID,
      league: selectedLeague as League,
    },
    {
      retry: false,
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    },
  );

  const rows = useMemo(() => {
    if (data?.type !== ContestType.FANTASY) {
      return [];
    }

    return data?.offers.filter((offer) => offer.type === 'PP');
  }, [data]);

  return (
    <>
      <BackdropLoading open={isLoading} />
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          slots={{
            toolbar: () => {
              return (
                <div className={'flex-grow p-2 border-b'}>
                  <TextField
                    id="league"
                    select
                    label="Select league"
                    size={'small'}
                    value={selectedLeague}
                    sx={{ width: 200 }}
                    onChange={(e) =>
                      setSelectedLeague(e.target.value as League)
                    }
                  >
                    <MenuItem key={'empty-league'} value={undefined}>
                      <span className={'italic text-gray-400'}>
                        Select league
                      </span>
                    </MenuItem>
                    {Object.values(League).map((value: League) => (
                      <MenuItem key={value} value={value}>
                        {value.toUpperCase()}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              );
            },
          }}
          rows={rows}
          getRowId={(row) => row.id}
          columns={[
            {
              field: 'id',
              flex: 1,
              headerName: 'ID',
              renderCell: (params) => {
                const currentRow = params.row as (typeof rows)[0];
                return <TruncateCellContent value={currentRow?.id as string} />;
              },
            },
            {
              field: 'league',
              flex: 1,
              headerName: 'League',
            },
            {
              field: 'playerName',
              flex: 1,
              headerName: 'Player',
            },
            {
              field: 'statName',
              flex: 1,
              headerName: 'Stat',
            },
            {
              field: 'matchName',
              flex: 1,
              headerName: 'Match Up',
            },
            {
              field: 'matchTime',
              flex: 1,
              headerName: 'Match DateTime',
            },
            {
              field: 'underOdds',
              flex: 1,
              headerName: 'Under Odds',
            },
            {
              field: 'overOdds',
              flex: 1,
              headerName: 'Over Odds',
            },
          ]}
        />
      </div>
    </>
  );
}
