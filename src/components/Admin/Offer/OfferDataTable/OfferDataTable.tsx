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
  handleCopyOffer: (id: string) => void;
  handleDeleteOffer: (id: string) => void;
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
          <div className={'flex flex-nowrap gap-2'}>
            <Button
              variant={'outlined'}
              onClick={() => {
                props.handleEditOffer(info.row.original);
              }}
            >
              Edit
            </Button>
            <Button
              variant={'contained'}
              onClick={() => {
                props.handleCopyOffer(info.row.original.gid);
              }}
              color={'primary'}
            >
              Copy
            </Button>
            <Button
              variant={'contained'}
              onClick={() => {
                props.handleDeleteOffer(info.row.original.gid);
              }}
              color={'warning'}
            >
              Delete
            </Button>
          </div>
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
