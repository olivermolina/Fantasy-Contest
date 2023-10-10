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
import { TruncateCellContent } from '~/components/Pages/Admin/LineExposure/LineExposure';
import type { TSEVOBillingType } from '~/server/routers/admin/tsevoBillingReport';

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
  const { data } = trpc.admin.tsevoBillingReport.useQuery(
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
      <div className={'h-[75vh] lg:h-[80vh] w-full'}>
        <DataGrid
          slots={{
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
                    <GridToolbarQuickFilter />
                  </GridToolbarContainer>
                </div>
              );
            },
          }}
          rows={data || []}
          getRowId={(row) => row.sessionId}
          columns={[
            {
              field: 'sessionId',
              flex: 1,
              headerName: 'Session Id',
              renderCell: (params) => {
                const currentRow = params.row as TSEVOBillingType;
                return <TruncateCellContent value={currentRow.sessionId} />;
              },
            },
            { field: 'createdAt', flex: 1, headerName: 'Date' },
            {
              field: 'userId',
              flex: 1,
              headerName: 'User Id',
              renderCell: (params) => {
                const currentRow = params.row as TSEVOBillingType;
                return <TruncateCellContent value={currentRow.userId} />;
              },
            },
            {
              field: 'username',
              flex: 1,
              headerName: 'Username',
            },
            { field: 'type', flex: 1, headerName: 'Type' },
            { field: 'amount', flex: 1, headerName: 'Amount' },
            { field: 'fee', flex: 1, headerName: 'Service Fees' },
            { field: 'processingFee', flex: 1, headerName: 'Processing Fees' },
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
