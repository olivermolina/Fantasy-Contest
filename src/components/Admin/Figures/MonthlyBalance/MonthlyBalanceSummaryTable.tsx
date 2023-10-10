import React, { useMemo } from 'react';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TableFooter } from '@mui/material';
import AmountCellContent from '~/components/Admin/Figures/WeeklyBalance/AmountCellContent';
import dayjs from 'dayjs';

interface BalanceSummaryTableProps {
  data: any;
  viewInactive: boolean;
  inactiveCount: number;
  activeCount: number;
}

export default function MonthlyBalanceSummaryTable(
  props: BalanceSummaryTableProps,
) {
  const { data, viewInactive, inactiveCount, activeCount } = props;

  const weekColumns = useMemo(
    () =>
      Array.isArray(data) && data.length > 0
        ? Object.keys(data?.[0]).filter((key) => key.includes('week'))
        : [],
    [data],
  );

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: 'Player',
        footer: () => (
          <span className={'text-bold font-bold text-black'}>Grand Total</span>
        ),
      },
      {
        header: 'Deposited',
      },
      ...weekColumns.map((key) => ({
        accessorKey: key,
        header: () => (
          <div className={'flex flex-col'}>
            <span>{key.toUpperCase()}</span>
            <span className={'text-xs italic'}>
              {dayjs(data[0]?.[key]?.from).format('MM-DD')} to{' '}
              {dayjs(data[0]?.[key]?.to).format('MM-DD')}
            </span>
          </div>
        ),
        footer: ({ table }: any) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total: number, row: any) => total + row.original[key].balance,
                0,
              )}
          />
        ),
      })),
      {
        accessorKey: 'totalMonthlyBalance',
        header: () => <span>Total Month</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.totalMonthlyBalance,
                0,
              )}
          />
        ),
      },
      {
        accessorKey: 'deposits',
        header: () => <span>Deposits</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce((total, row) => total + row.original.deposits, 0)}
          />
        ),
      },
      {
        accessorKey: 'withdrawals',
        header: () => <span>Withdrawals</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce((total, row) => total + row.original.withdrawals, 0)}
          />
        ),
      },
      {
        accessorKey: 'pendingTotal',
        header: () => <span>Pending</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.pendingTotal,
                0,
              )}
          />
        ),
      },
      {
        accessorKey: 'withdrawable',
        header: () => <span>Amount Avail to Withdraw</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.withdrawable,
                0,
              )}
          />
        ),
      },
      {
        accessorKey: 'creditAmount',
        header: () => <span>Bonus Bal</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.creditAmount,
                0,
              )}
          />
        ),
      },
      {
        accessorKey: 'totalBalance',
        header: () => <span>Total Balance</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.totalBalance,
                0,
              )}
          />
        ),
      },
    ],
    [weekColumns, data],
  );

  const tableData = useMemo(
    () => data.filter((row: any) => row.isActive === !viewInactive),
    [data, viewInactive],
  );

  const table = useReactTable({
    data: tableData,
    columns: columns || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    enableSorting: false,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            justifyContent: 'center',
          }}
          className={'bg-blue-500 text-white'}
        >
          <Typography variant="h5">{'Monthly Balance Summary'}</Typography>
        </Toolbar>
        <TableContainer component={Paper}>
          <Table aria-label="Monthly Balance Summary">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableCell
                        key={header.id}
                        sx={{
                          fontWeight: 'bold',
                          color: '#666',
                          border: '1px solid rgba(224, 224, 224, 1)',
                        }}
                        align={'center'}
                        colSpan={header.id === 'Player' ? 3 : header.colSpan}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableFooter>
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow
                  key={footerGroup.id}
                  sx={{
                    border: 0,
                    backgroundColor: '#e8e8e8',
                  }}
                  hover
                >
                  {footerGroup.headers
                    .filter((header) => header.id !== 'Deposited')
                    .map((header) => (
                      <TableCell
                        key={header.id}
                        align={'center'}
                        sx={{
                          fontWeight: 'bold',
                          fontSize: 14,
                          border: '1px solid rgba(224, 224, 224, 1)',
                        }}
                        colSpan={header.id === 'Player' ? 4 : header.colSpan}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.footer,
                              header.getContext(),
                            )}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  align="center"
                  sx={{
                    border: '1px solid rgba(224, 224, 224, 1)',
                  }}
                >
                  <span className={'text-lg font-bold mr-5'}>
                    Total Active Players: {activeCount}
                  </span>
                  <span className={'text-lg font-bold'}>
                    Total Inactive Players: {inactiveCount}
                  </span>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
