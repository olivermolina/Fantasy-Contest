import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import PickDatePickerRange from '~/components/Picks/PickDatePickerRange';
import {
  DataGrid,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import updateLocale from 'dayjs/plugin/updateLocale';
import { AmountCellRender } from '~/pages/admin/user-performance-by-sport';
import { TruncateCellContent } from '~/components/Pages/Admin/LineExposure/LineExposure';
import CustomNoEventsOverlay from '~/components/Pages/Admin/TournamentEvents/CustomNoEventsOverlay';
import LinearProgress from '@mui/material/LinearProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';

dayjs.extend(updateLocale);
dayjs.extend(weekday);

export default function UserPerformanceBySportPage() {
  const router = useRouter();
  const from = router.query.from
    ? dayjs(router.query.from as string)
        .startOf('D')
        .toDate()
    : dayjs().weekday(1).toDate();
  const to = router.query.to
    ? dayjs(router.query.to as string)
        .startOf('D')
        .toDate()
    : dayjs().weekday(7).toDate();

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const { data, isLoading } =
    trpc.admin.userPerformanceBySportCategory.useQuery(
      {
        // These NEED to be startOf otherwise the query will infinitely loop due to react-query checking the equality of the input (which is a new object every time due to the new seconds value of the date)
        from: dayjs(from).format('YYYY-MM-DD'),
        to: dayjs(to).format('YYYY-MM-DD'),
        includeFreeCreditStake: checked,
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
      },
    );
  return (
    <AdminLayoutContainer>
      <div className={'flex flex-col gap-4 w-full h-full'}>
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

        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
          label="Include Free Credits Stake"
        />

        <div className={'flex flex-col h-full w-full gap-4'}>
          {data && Object.keys(data).length ? (
            Object.keys(data).map((sport) => (
              <DataGrid
                key={sport}
                loading={isLoading}
                slots={{
                  noRowsOverlay: CustomNoEventsOverlay,
                  loadingOverlay: LinearProgress,
                  toolbar: () => {
                    return (
                      <div
                        className={
                          'flex flex-col gap-2 p-2 border-b border-b-gray-300'
                        }
                      >
                        <p className={'text-xl font-semibold'}>{sport}</p>
                        <div className={'flex justify-between'}>
                          <GridToolbarContainer>
                            <GridToolbarQuickFilter />
                          </GridToolbarContainer>
                        </div>
                      </div>
                    );
                  },
                }}
                rows={data[sport]!.data || []}
                getRowId={(row) => row.id}
                columns={[
                  {
                    field: 'id',
                    flex: 1,
                    headerName: 'User ID',
                    renderCell: (params) => {
                      const currentRow = params.row;
                      return (
                        <TruncateCellContent value={currentRow?.id as string} />
                      );
                    },
                  },
                  { field: 'username', flex: 1, headerName: 'Username' },
                  ...data[sport]!.categories.map((category) => ({
                    field: category,
                    flex: 1,
                    headerName: category,
                    renderCell: (params: GridRenderCellParams) => (
                      <AmountCellRender value={params.value} />
                    ),
                  })),
                  {
                    field: 'total',
                    flex: 1,
                    headerName: 'Total',
                    renderCell: (params) => (
                      <AmountCellRender value={params.value} />
                    ),
                  },
                ]}
                slotProps={{
                  toolbar: {
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                hideFooterSelectedRowCount
              />
            ))
          ) : (
            <CustomNoEventsOverlay message={'No data found'} />
          )}
        </div>
      </div>
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
