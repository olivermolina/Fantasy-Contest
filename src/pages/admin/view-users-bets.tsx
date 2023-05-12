import React, { useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import dayjs from 'dayjs';
import PickDatePickerRange from '~/components/Picks/PickDatePickerRange';
import { DataGrid } from '@mui/x-data-grid';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';
import PendingPickDialog from '~/components/Pages/Admin/PendingBetsManagement/PendingPickDialog';
import { RowModel } from '~/components/Pages/Admin/PendingBetsManagement/PendingBetsManagement';
import { Button } from '@mui/material';

export default function ViewUsersBetsPage() {
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState<RowModel | undefined>();
  const router = useRouter();
  const from = router.query.from
    ? dayjs(router.query.from as string)
        .startOf('D')
        .toDate()
    : dayjs().subtract(1, 'month').startOf('D').toDate();
  const to = router.query.to
    ? dayjs(router.query.to as string)
        .startOf('D')
        .toDate()
    : dayjs().startOf('D').toDate();
  const { data } = trpc.admin.usersBetLists.useQuery(
    {
      // These NEED to be startOf otherwise the query will infinitely loop due to react-query checking the equality of the input (which is a new object every time due to the new seconds value of the date)
      from,
      to,
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );
  const clearSelectedRow = () => {
    setSelectedRow(undefined);
    handleClose();
  };
  const handleClose = () => {
    setOpen(false);
  };

  const rows = useMemo(() => data || [], [data]);
  return (
    <AdminLayoutContainer>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          slots={{
            toolbar: () => {
              return (
                <div className={'p-2'}>
                  <PickDatePickerRange
                    setDateRangeValue={({ startDate, endDate }) => {
                      router.push({
                        query: {
                          from: startDate.startOf('D').toISOString(),
                          to: endDate.startOf('D').toISOString(),
                        },
                      });
                    }}
                    dateRangeValue={{
                      startDate: dayjs(from),
                      endDate: dayjs(to),
                    }}
                  />
                </div>
              );
            },
          }}
          rows={rows}
          getRowId={(row) => row.ticket}
          columns={[
            { field: 'ticket', flex: 1, headerName: 'Bet ID' },
            {
              field: 'username',
              flex: 1,
              headerName: 'Username',
            },
            {
              field: 'name',
              flex: 1,
              headerName: 'Name',
            },
            {
              field: 'riskWin',
              flex: 1,
              headerName: 'Risk/Win',
            },
            { field: 'status', flex: 1, headerName: 'Status' },
            {
              field: 'type',
              flex: 1,
              headerName: 'Type',
            },
            {
              field: 'view',
              flex: 1,
              headerName: 'Action',

              renderCell: (params) => {
                const onClick = () => {
                  const currentRow = params.row as typeof rows[0];
                  setSelectedRow(currentRow);
                  setOpen(true);
                };

                return (
                  <div className={'flex gap-1'}>
                    <Button
                      color="warning"
                      size="small"
                      onClick={onClick}
                      variant={'contained'}
                    >
                      VIEW PICKS
                    </Button>
                  </div>
                );
              },
            },
          ]}
        />
      </div>
      {selectedRow && (
        <PendingPickDialog
          onClickDeleteRow={() => {
            // no action
          }}
          clearSelectedRow={clearSelectedRow}
          open={open}
          row={selectedRow}
          handleClose={handleClose}
          isViewOnly={true}
        />
      )}
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
