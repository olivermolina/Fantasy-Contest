import React, { useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  AgentWithUser,
  IPlayerWeeklyBalance,
} from '~/server/routers/admin/figures/weeklyBalances/weeklyBalances';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { fuzzyFilter } from '~/components/CustomDataTable/CustomDataTable';
import { TableFooter } from '@mui/material';
import { DayOfWeek } from '~/constants/DayOfWeek';
import { BalanceDateRage } from '~/server/routers/admin/figures/weeklyBalances/playerWeeklyBalance';
import AmountCellContent from '~/components/Admin/Figures/WeeklyBalance/AmountCellContent';
import { PickStatus } from '~/constants/PickStatus';

interface BalanceTableByAgentProps {
  agent: AgentWithUser | null;
  data: IPlayerWeeklyBalance[];
  globalFilter: string;
  setGlobalFilter: (value: ((prevState: string) => string) | string) => void;
  handleSetDateFilter: (
    dateRange: BalanceDateRage,
    dayOfWeek?: DayOfWeek,
  ) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPlayer: React.Dispatch<
    React.SetStateAction<IPlayerWeeklyBalance | null>
  >;
  dateRange: BalanceDateRage;
  setSelectedTabStatus: React.Dispatch<React.SetStateAction<PickStatus>>;
  setShowTabTitle: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BalanceTableByAgent(props: BalanceTableByAgentProps) {
  const {
    data,
    agent,
    globalFilter,
    setGlobalFilter,
    handleSetDateFilter,
    setOpen,
    setSelectedPlayer,
    dateRange,
    setSelectedTabStatus,
    setShowTabTitle,
  } = props;

  const columns = useMemo<ColumnDef<IPlayerWeeklyBalance>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.firstname,
        accessorKey: 'firstname',
        header: 'First Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.lastname,
        accessorKey: 'lastname',
        cell: (info) => info.getValue(),
        header: 'Last Name',
      },
      {
        accessorFn: (row) => row.username,
        accessorKey: 'username',
        cell: (info) => info.getValue(),
        header: 'Username',
      },
      {
        header: 'Player',
        cell: (info) => {
          const { username, referral } = info.row.original;
          return referral ? `${username} - ${referral}` : username;
        },
        footer: () => (
          <span className={'text-bold font-bold text-black'}>Total</span>
        ),
      },
      {
        accessorKey: 'isFirstDeposit',
        cell: (info) => (Boolean(info.getValue()) ? 'FALSE' : 'TRUE'),
        header: 'Deposited',
      },
      {
        accessorKey: 'mondayBalance',
        cell: (info) => (
          <AmountCellContent
            amount={info.getValue() as number}
            onClick={() => {
              setShowTabTitle(false);
              handleSetDateFilter(dateRange, DayOfWeek.MONDAY);
              setSelectedTabStatus(PickStatus.SETTLED);
              setOpen(true);
              setSelectedPlayer(info.row.original);
            }}
          />
        ),
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
        cell: (info) => (
          <AmountCellContent
            amount={info.getValue() as number}
            onClick={() => {
              setShowTabTitle(false);
              handleSetDateFilter(dateRange, DayOfWeek.TUESDAY);
              setSelectedTabStatus(PickStatus.SETTLED);
              setOpen(true);
              setSelectedPlayer(info.row.original);
            }}
          />
        ),
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
        cell: (info) => (
          <AmountCellContent
            amount={info.getValue() as number}
            onClick={() => {
              setShowTabTitle(false);
              setSelectedTabStatus(PickStatus.SETTLED);
              handleSetDateFilter(dateRange, DayOfWeek.WEDNESDAY);
              setOpen(true);
              setSelectedPlayer(info.row.original);
            }}
          />
        ),
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
        cell: (info) => (
          <AmountCellContent
            amount={info.getValue() as number}
            onClick={() => {
              setShowTabTitle(false);
              setSelectedTabStatus(PickStatus.SETTLED);
              handleSetDateFilter(dateRange, DayOfWeek.THURSDAY);
              setOpen(true);
              setSelectedPlayer(info.row.original);
            }}
          />
        ),
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
        cell: (info) => (
          <AmountCellContent
            amount={info.getValue() as number}
            onClick={() => {
              setShowTabTitle(false);
              setSelectedTabStatus(PickStatus.SETTLED);
              handleSetDateFilter(dateRange, DayOfWeek.FRIDAY);
              setOpen(true);
              setSelectedPlayer(info.row.original);
            }}
          />
        ),
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
        cell: (info) => (
          <AmountCellContent
            amount={info.getValue() as number}
            onClick={() => {
              setShowTabTitle(false);
              setSelectedTabStatus(PickStatus.SETTLED);
              handleSetDateFilter(dateRange, DayOfWeek.SATURDAY);
              setOpen(true);
              setSelectedPlayer(info.row.original);
            }}
          />
        ),
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
        cell: (info) => (
          <AmountCellContent
            amount={info.getValue() as number}
            onClick={() => {
              setShowTabTitle(false);
              setSelectedTabStatus(PickStatus.SETTLED);
              handleSetDateFilter(dateRange, DayOfWeek.SUNDAY);
              setOpen(true);
              setSelectedPlayer(info.row.original);
            }}
          />
        ),
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
        cell: (info) => (
          <AmountCellContent
            amount={info.getValue() as number}
            onClick={() => {
              setShowTabTitle(false);
              setSelectedTabStatus(PickStatus.SETTLED);
              handleSetDateFilter(dateRange);
              setOpen(true);
              setSelectedPlayer(info.row.original);
            }}
          />
        ),
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
        cell: (info) => (
          <AmountCellContent amount={info.getValue() as number} />
        ),
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
        cell: (info) => (
          <AmountCellContent amount={info.getValue() as number} />
        ),
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
        cell: (info) => (
          <AmountCellContent
            amount={info.getValue() as number}
            onClick={() => {
              setShowTabTitle(false);
              setSelectedTabStatus(PickStatus.PENDING);
              handleSetDateFilter(dateRange);
              setOpen(true);
              setSelectedPlayer(info.row.original);
            }}
          />
        ),
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
        cell: (info) => (
          <AmountCellContent amount={info.getValue() as number} />
        ),
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
        cell: (info) => (
          <AmountCellContent amount={info.getValue() as number} />
        ),
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
        cell: (info) => (
          <AmountCellContent amount={info.getValue() as number} />
        ),
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
    [dateRange],
  );

  const table = useReactTable({
    data,
    columns: columns || [],
    state: {
      globalFilter,
      columnVisibility: {
        id: false,
        firstname: false,
        lastname: false,
        username: false,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    enableSorting: false,
  });

  const { rows } = table.getRowModel();

  // Hide table if there are data
  if (data.length === 0) {
    return null;
  }

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
          <Typography variant="h5">
            {agent?.User?.username || 'LockSpread'}
          </Typography>
        </Toolbar>
        <TableContainer component={Paper}>
          <Table aria-label="Players Balance by agent">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableCell
                        key={header.id}
                        sx={{
                          fontWeight: 'bold',
                          color: '#666666FF',
                          border: '1px solid rgba(224, 224, 224, 1)',
                        }}
                        align={'center'}
                        colSpan={header.colSpan}
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
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow key={row.id} hover>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          align={'center'}
                          sx={{
                            border: '1px solid rgba(224, 224, 224, 1)',
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
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
                  {footerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      align={'center'}
                      colSpan={header.colSpan}
                      sx={{
                        fontWeight: 'bold',
                        fontSize: 14,
                        border: '1px solid rgba(224, 224, 224, 1)',
                      }}
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
                  colSpan={columns.length}
                  align="center"
                  sx={{
                    border: '1px solid rgba(224, 224, 224, 1)',
                  }}
                >
                  <span className={'text-lg font-bold'}>
                    Players Total: {data.length}
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
