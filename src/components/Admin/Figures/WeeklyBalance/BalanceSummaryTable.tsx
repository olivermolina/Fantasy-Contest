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
import { IPlayerWeeklyBalance } from '~/server/routers/admin/figures/weeklyBalances/weeklyBalances';
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

interface BalanceSummaryTableProps {
  data: IPlayerWeeklyBalance[];
  viewInactive: boolean;
  inactiveCount: number;
  activeCount: number;
}

export default function BalanceSummaryTable(props: BalanceSummaryTableProps) {
  const { data, viewInactive, inactiveCount, activeCount } = props;

  const columns = useMemo<ColumnDef<IPlayerWeeklyBalance>[]>(
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
      {
        accessorKey: 'mondayBalance',
        header: () => <span>Mon</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.mondayBalance,
                0,
              )}
          />
        ),
      },
      {
        accessorKey: 'tuesdayBalance',
        header: () => <span>Tue</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.tuesdayBalance,
                0,
              )}
          />
        ),
      },
      {
        accessorKey: 'wednesdayBalance',
        header: () => <span>Wed</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.wednesdayBalance,
                0,
              )}
          />
        ),
      },
      {
        accessorKey: 'thursdayBalance',
        header: () => <span>Thu</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.thursdayBalance,
                0,
              )}
          />
        ),
      },
      {
        accessorKey: 'fridayBalance',
        header: () => <span>Fri</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.fridayBalance,
                0,
              )}
          />
        ),
      },
      {
        accessorKey: 'saturdayBalance',
        header: () => <span>Sat</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.saturdayBalance,
                0,
              )}
          />
        ),
      },
      {
        accessorKey: 'sundayBalance',
        header: () => <span>Sun</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.sundayBalance,
                0,
              )}
          />
        ),
      },
      {
        accessorKey: 'totalWeekBalance',
        header: () => <span>Total Week</span>,
        footer: ({ table }) => (
          <AmountCellContent
            amount={table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + row.original.totalWeekBalance,
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
    [],
  );

  const tableData = useMemo(
    () => data.filter((row) => row.isActive === !viewInactive),
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
          <Typography variant="h5">{'Weekly Balance Summary'}</Typography>
        </Toolbar>
        <TableContainer component={Paper}>
          <Table aria-label="Weekly Balance Summary">
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
