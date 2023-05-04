import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import dayjs from 'dayjs';
import PickDatePickerRange from '~/components/Picks/PickDatePickerRange';
import { DataGrid } from '@mui/x-data-grid';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function UsersBalancePage() {
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
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          components={{
            Toolbar: () => {
              return (
                <div className={'bg-secondary p-2'}>
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
          rows={data || []}
          getRowId={(row) => row.player}
          columns={[
            { field: 'player', flex: 1, headerName: 'Player' },
            { field: 'lastWager', flex: 1, headerName: 'Last wager' },
            { field: 'openBets', flex: 1, headerName: 'Open bets' },
            {
              field: 'gradedBetsAmount',
              flex: 1,
              headerName: 'Graded bets amount',
            },
            { field: 'win', flex: 1, headerName: 'Win' },
            { field: 'loss', flex: 1, headerName: 'Loss' },
            { field: 'net', flex: 1, headerName: 'Net' },
            { field: 'currency', flex: 1, headerName: 'Currency' },
            { field: 'currentBalance', flex: 1, headerName: 'Current balance' },
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
