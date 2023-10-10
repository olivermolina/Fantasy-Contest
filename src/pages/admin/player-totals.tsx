import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import dayjs from 'dayjs';
import PickDatePickerRange from '~/components/Picks/PickDatePickerRange';
import { DataGrid } from '@mui/x-data-grid';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';
import { AmountCellRender } from '~/pages/admin/user-performance-by-sport';

export default function AdminPlayerTotalsPage() {
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
  const { data } = trpc.admin.playerStats.useQuery(
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
  return (
    <AdminLayoutContainer>
      <div className={'w-full h-[75vh]'}>
        <DataGrid
          slots={{
            toolbar: () => {
              return (
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
              );
            },
          }}
          rows={data || []}
          getRowId={(row) => row.player}
          columns={[
            { field: 'name', flex: 2, headerName: 'Name' },
            { field: 'player', flex: 1, headerName: 'Username' },
            { field: 'lastWager', flex: 1, headerName: 'Last Entry Amount' },
            { field: 'openBets', flex: 1, headerName: 'Open bets' },
            {
              field: 'gradedBetsAmount',
              flex: 1,
              headerName: 'Graded bets amount',
            },
            {
              field: 'win',
              flex: 1,
              headerName: 'Total Wins',
              renderCell: (params) => <AmountCellRender value={params.value} />,
            },
            {
              field: 'loss',
              flex: 1,
              headerName: 'Total Losses',
              renderCell: (params) => <AmountCellRender value={params.value} />,
            },
            {
              field: 'net',
              flex: 1,
              headerName: 'Net Income',
              renderCell: (params) => <AmountCellRender value={params.value} />,
            },
            {
              field: 'deposits',
              flex: 1,
              headerName: 'Total Deposits',
              renderCell: (params) => <AmountCellRender value={params.value} />,
            },
            {
              field: 'withdrawals',
              flex: 1,
              headerName: 'Total Withdrawals',
              renderCell: (params) => <AmountCellRender value={params.value} />,
            },
            {
              field: 'currentBalance',
              flex: 1,
              headerName: 'Total balance',
              renderCell: (params) => <AmountCellRender value={params.value} />,
            },
            {
              field: 'amountAvailableToWithdraw',
              flex: 1,
              headerName: 'Amount Available to Withdraw',
              renderCell: (params) => <AmountCellRender value={params.value} />,
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
