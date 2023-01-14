import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@mui/material';
import CustomDataTable from '~/components/CustomDataTable';
import { OfferWithTeams } from '~/components/Admin/Offer/OfferForm/OfferForm';

interface PropsOfferDataTable {
  isLoading: boolean;
  flatData: OfferWithTeams[];
  handleNew: () => void;
  totalDBRowCount: number;
  totalFetched: number;
  isFetching: boolean;
  fetchNextPage: any;
  handleEditOffer: (offer: OfferWithTeams) => void;
}

function OfferDataTable(props: PropsOfferDataTable) {
  const columns = React.useMemo<ColumnDef<OfferWithTeams>[]>(
    () => [
      {
        accessorKey: 'gid',
        header: 'ID',
        size: 60,
      },
      {
        accessorKey: 'league',
        cell: (info) => info.getValue(),
        header: () => <span>League</span>,
      },
      {
        accessorFn: (row) => row.gamedate,
        id: 'gamedate',
        cell: (info) => info.getValue(),
        header: () => <span>Game Date</span>,
      },
      {
        accessorFn: (row) => row.gametime,
        id: 'gametime',
        cell: (info) => info.getValue(),
        header: () => <span>Game Time</span>,
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        cell: (info) => info.getValue(),
        header: () => <span>Status</span>,
      },
      {
        accessorFn: (row) => row.matchup,
        id: 'matchup',
        cell: (info) => info.getValue(),
        header: () => <span>Matchup</span>,
      },
      {
        header: 'Action',
        cell: (info) => (
          <Button
            variant={'outlined'}
            onClick={() => {
              props.handleEditOffer(info.row.original);
            }}
          >
            Edit
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <CustomDataTable
      {...props}
      tableTitle={'Offers'}
      searchPlaceholder={'Search Offer'}
      columns={columns}
    />
  );
}

export default OfferDataTable;
