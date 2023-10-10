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

export default function AdminMonthlyUserConversionPage() {
  const router = useRouter();
  const from = router.query.from
    ? dayjs(router.query.from as string)
        .startOf('D')
        .toDate()
    : dayjs().startOf('month').toDate();
  const to = router.query.to
    ? dayjs(router.query.to as string)
        .startOf('D')
        .toDate()
    : dayjs().endOf('month').toDate();
  const { data } = trpc.admin.userConversion.useQuery(
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
            {
              field: 'id',
              headerName: 'ID',
              renderCell: (params) => (
                <TruncateCellContent value={params.value} />
              ),
            },
            { field: 'name', flex: 1, headerName: 'Name' },
            { field: 'username', flex: 1, headerName: 'Username' },
            { field: 'referral', flex: 1, headerName: 'Referral' },
            { field: 'signupDate', flex: 1, headerName: 'Sign-Up Date' },
            { field: 'deposited', flex: 1, headerName: 'Deposited' },
            { field: 'depositedDate', flex: 1, headerName: 'Deposited Date' },
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
