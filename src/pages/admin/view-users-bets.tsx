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
import {
  LegRowModel,
  RowModel,
} from '~/components/Pages/Admin/PendingBetsManagement/PendingBetsManagement';
import { Button } from '@mui/material';
import { TruncateCellContent } from '~/components/Pages/Admin/LineExposure/LineExposure';
import { BetStatus } from '@prisma/client';
import { toast } from 'react-toastify';
import BackdropLoading from '~/components/BackdropLoading';

export default function ViewUsersBetsPage() {
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState<RowModel | undefined>();
  const [betStatus, setBetStatus] = useState<BetStatus | undefined>();
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
  const { data, refetch, isLoading } = trpc.admin.usersBetLists.useQuery(
    {
      // These NEED to be startOf otherwise the query will infinitely loop due to react-query checking the equality of the input (which is a new object every time due to the new seconds value of the date)
      from,
      to,
    },
    {
      retry: false,
    },
  );

  const mutation = trpc.admin.settlePendingBet.useMutation();
  const settlePick = async (currentRow: RowModel, betStatus: BetStatus) => {
    try {
      await mutation.mutateAsync({ betId: currentRow.ticket, betStatus });
      await refetch();
      toast.success('Status updated successfully');
    } catch (e) {
      toast.error('Something went wrong. Please try again later.');
    }
  };

  const updateBetLegMutation = trpc.admin.updateBetLeg.useMutation();
  const updateBetLeg = async (leg: LegRowModel, status: BetStatus) => {
    try {
      await updateBetLegMutation.mutateAsync({ id: leg.id, status });
      await refetch();
      toast.success('Leg status updated successfully');
    } catch (e) {
      toast.error('Error updating bet status');
    }
  };

  const clearSelectedRow = () => {
    setSelectedRow(undefined);
    handleClose();
  };
  const handleClose = () => {
    setOpen(false);
    setBetStatus(undefined);
  };

  const setSelectedBetStatus = (betStatus: BetStatus) => {
    setBetStatus(betStatus);
  };

  const rows = useMemo(() => data || [], [data]);
  return (
    <AdminLayoutContainer>
      <BackdropLoading
        open={isLoading || mutation.isLoading || updateBetLegMutation.isLoading}
      />
      <div className={'h-[75vh] lg:h-[80vh] w-full'}>
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
            {
              field: 'ticket',
              flex: 1,
              headerName: 'Bet ID',
              renderCell: (params) => {
                const currentRow = params.row as (typeof rows)[0];
                return <TruncateCellContent value={currentRow.ticket} />;
              },
            },
            {
              field: 'placed',
              flex: 1,
              headerName: 'Date Placed',
            },
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
              field: 'picks',
              flex: 1,
              headerName: '# of Picks',
              renderCell: (params) => {
                const currentRow = params.row as (typeof rows)[0];
                return currentRow.legs.length;
              },
            },
            {
              field: 'view',
              flex: 1,
              headerName: 'Action',

              renderCell: (params) => {
                const onClick = () => {
                  const currentRow = params.row as (typeof rows)[0];
                  setSelectedRow(currentRow);
                  setBetStatus(currentRow.status);
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
                      EDIT PICKS
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
          settlePick={settlePick}
          clearSelectedRow={clearSelectedRow}
          open={open}
          row={selectedRow}
          handleClose={handleClose}
          setSelectedBetStatus={setSelectedBetStatus}
          betStatus={betStatus}
          updateBetLeg={updateBetLeg}
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
