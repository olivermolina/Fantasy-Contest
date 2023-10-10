import React, { useEffect } from 'react';
import { UserBalance } from '~/server/routers/admin/usersBalance';
import Link from 'next/link';
import { DataGrid, GridRowsProp, GridToolbar } from '@mui/x-data-grid';
import CustomNoEventsOverlay from '~/components/Pages/Admin/TournamentEvents/CustomNoEventsOverlay';
import LinearProgress from '@mui/material/LinearProgress';

interface PropsOfferDataTable {
  isLoading: boolean;
  data?: UserBalance[];
}

function UsersBalanceDataTable(props: PropsOfferDataTable) {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  useEffect(() => {
    if (props.data) {
      setRows(props.data);
    }
  }, [props.data]);
  return (
    <div className={'w-full h-[75vh]'}>
      <DataGrid
        loading={props.isLoading}
        slots={{
          noRowsOverlay: CustomNoEventsOverlay,
          loadingOverlay: LinearProgress,
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        rows={rows}
        getRowId={(row) => row.id}
        columns={[
          { field: 'id', flex: 2, headerName: 'ID' },
          { field: 'username', flex: 1, headerName: 'Username' },
          { field: 'email', flex: 1, headerName: 'Email' },
          { field: 'firstname', flex: 1, headerName: 'First Name' },
          { field: 'lastname', flex: 1, headerName: 'Last Name' },
          { field: 'referral', flex: 1, headerName: 'Referred By' },
          {
            field: 'totalAmount',
            flex: 1,
            headerName: 'Total Balance',
            type: 'number',
          },
          {
            field: 'totalCashAmount',
            flex: 1,
            headerName: 'Cash Balance',
            type: 'number',
          },
          {
            field: 'creditAmount',
            flex: 1,
            headerName: 'Bonus Balance',
            type: 'number',
          },
          {
            field: 'withdrawableAmount',
            flex: 1,
            headerName: 'Available To Withdraw',
            type: 'number',
          },

          {
            field: 'picks',
            headerName: 'Picks',
            width: 150,
            renderCell: (params) => (
              <Link href={`/picks?userId=${params.id}`} legacyBehavior>
                <a
                  className={'underline text-blue-500'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </Link>
            ),
          },
        ]}
        editMode="row"
      />
    </div>
  );
}

export default UsersBalanceDataTable;
