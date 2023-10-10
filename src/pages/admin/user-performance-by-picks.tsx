import React, { useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import PickDatePickerRange from '~/components/Picks/PickDatePickerRange';
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';
import { TruncateCellContent } from '~/components/Pages/Admin/LineExposure/LineExposure';
import classNames from 'classnames';
import { Checkbox, FormControlLabel, LinearProgress } from '@mui/material';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import updateLocale from 'dayjs/plugin/updateLocale';
import CustomNoEventsOverlay from '~/components/Pages/Admin/TournamentEvents/CustomNoEventsOverlay';

dayjs.extend(updateLocale);
dayjs.extend(weekday);

const AmountCellRender = ({ value }: { value: number }) => {
  return (
    <div
      className={classNames(`flex items-center justify-center`, {
        'text-green-700': value > 0,
        'text-red-500': value < 0,
      })}
    >
      {value.toFixed(2)}
    </div>
  );
};

export default function UserPerformanceByPicksPage() {
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

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const { data, isLoading } = trpc.admin.userPerformanceByPicks.useQuery(
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

  const defaultColumns: GridColDef[] = [
    {
      field: 'id',
      flex: 1,
      headerName: 'User ID',
      renderCell: (params) => {
        const currentRow = params.row;
        return <TruncateCellContent value={currentRow?.id as string} />;
      },
    },
    { field: 'username', flex: 1, headerName: 'Username' },
  ];

  const totalColumn: GridColDef = {
    field: 'total',
    flex: 1,
    headerName: 'Total',
    renderCell: (params) => <AmountCellRender value={params.value} />,
  };

  const columns: GridColDef[] = useMemo(
    () =>
      (data && data.length > 0
        ? [
            ...defaultColumns,
            ...Object.keys(data[0]!)
              .filter((key) => key.includes('picks'))
              .map(
                (key) =>
                  ({
                    field: key,
                    flex: 1,
                    headerName: key.includes('insured') ? 'Insured' : 'All-In',
                    align: 'center',
                    renderCell: (params) => (
                      <AmountCellRender value={params.value} />
                    ),
                  } as GridColDef),
              ),
            totalColumn,
          ]
        : [...defaultColumns, totalColumn]) as GridColDef[],
    [data],
  );

  const columnGroupingModel: GridColumnGroupingModel = useMemo(
    () =>
      (data && data.length > 0
        ? [
            ...Object.keys(data[0]!)
              .filter((key) => key.includes('insured-picks'))
              .map((key) => ({
                groupId: key.replace('insured-picks', ' Picks'),
                flex: 1,
                headerAlign: 'center',
                children: [
                  {
                    field: key,
                    headerName: 'Insured',
                  },
                  {
                    field: key.replace('insured-picks', 'allin-picks'),
                    headerName: 'All-In',
                  },
                ],
              })),
          ]
        : []) as GridColumnGroupingModel,
    [data],
  );

  return (
    <AdminLayoutContainer>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          experimentalFeatures={{ columnGrouping: true }}
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
                  <div className={'flex justify-between'}>
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

                    <GridToolbarContainer>
                      <GridToolbarQuickFilter />
                    </GridToolbarContainer>
                  </div>
                </div>
              );
            },
          }}
          rows={data || []}
          getRowId={(row) => row.id}
          columns={columns}
          columnGroupingModel={columnGroupingModel}
          slotProps={{
            toolbar: {
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          hideFooterSelectedRowCount
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
