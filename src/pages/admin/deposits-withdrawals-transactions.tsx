import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import dayjs from 'dayjs';
import PickDatePickerRange from '~/components/Picks/PickDatePickerRange';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';
import CustomNoEventsOverlay from '~/components/Pages/Admin/TournamentEvents/CustomNoEventsOverlay';
import LinearProgress from '@mui/material/LinearProgress';
import { ActionType } from '~/constants/ActionType';

export default function DepositsWithdrawalsTransactionsPage() {
  const router = useRouter();
  const from = dayjs((router.query.from as string) ?? dayjs().startOf('M'));
  const to = dayjs((router.query.to as string) ?? dayjs().endOf('M'));

  const { isLoading, data } = trpc.user.transactionHistory.useQuery(
    {
      from: from.toISOString(),
      to: to.toISOString(),
      actionTypes: [ActionType.PAY, ActionType.PAYOUT],
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <AdminLayoutContainer>
      <div className={'w-full h-[75vh]'}>
        <DataGrid
          loading={isLoading}
          slots={{
            noRowsOverlay: CustomNoEventsOverlay,
            loadingOverlay: LinearProgress,

            toolbar: () => {
              return (
                <div className={'flex flex-col gap-2 p-2'}>
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
                  <GridToolbarContainer>
                    <GridToolbarExport />
                    <span className={'grow'} />
                    <GridToolbarQuickFilter />
                  </GridToolbarContainer>
                </div>
              );
            },
          }}
          rows={data || []}
          getRowId={(row) => row.id}
          columns={[
            { field: 'id', flex: 1, headerName: 'Transaction ID' },
            { field: 'userId', flex: 1, headerName: 'User ID' },
            { field: 'username', flex: 1, headerName: 'Username' },
            {
              field: 'transactionDate',
              flex: 1,
              headerName: 'Transaction Date',
            },
            { field: 'type', flex: 1, headerName: 'Type' },
            {
              field: 'details',
              flex: 1,
              headerName: 'Description',
            },
            {
              field: 'amount',
              flex: 1,
              headerName: 'Amount (USD)',
            },
            {
              field: 'amountBonus',
              flex: 1,
              headerName: 'Bonus Credits',
            },
            {
              field: 'status',
              flex: 1,
              headerName: 'Status',
            },
          ]}
        />
      </div>
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
