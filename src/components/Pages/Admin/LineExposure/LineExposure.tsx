import React, { useMemo, useState } from 'react';
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
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { fuzzyFilter } from '~/components/CustomDataTable/CustomDataTable';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import PickDatePickerRange, {
  DateRangeInterface,
} from '~/components/Picks/PickDatePickerRange';
import { MenuItem, TextField } from '@mui/material';
import type { ILineExposure } from '~/server/routers/admin/getLineExposures';
import { BetLegType, League } from '@prisma/client';
import { showDollarPrefix } from '~/utils/showDollarPrefix';
import Link from '@mui/material/Link';
import LineExposureDetailsDialog from '~/components/Pages/Admin/LineExposure/LineExposureDetailsDialog';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import dayjs from 'dayjs';
import CopyClipboardButton from '~/components/CopyClipboardButton/CopyClipboardButton';

export function TruncateCellContent(props: { value: string }) {
  return (
    <div className={'flex'}>
      <Box
        sx={{
          maxWidth: 50,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {props.value}
      </Box>
      <CopyClipboardButton text={props.value} />
    </div>
  );
}

interface LineExposureProps {
  data: ILineExposure[];
  setDateRange: React.Dispatch<React.SetStateAction<DateRangeInterface | null>>;
  dateRange: DateRangeInterface | null;
  selectedLeague: League;
  setSelectedLeague: React.Dispatch<React.SetStateAction<League>>;
}

export default function LineExposure(props: LineExposureProps) {
  const { setSelectedLeague, selectedLeague, dateRange, data, setDateRange } =
    props;
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedBetLegType, setSelectedBetLegType] = useState<
    BetLegType | undefined
  >();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ILineExposure | undefined>(
    undefined,
  );
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(undefined);
  };

  const columns = useMemo<ColumnDef<ILineExposure>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => (
          <TruncateCellContent value={info.getValue() as string} />
        ),
      },
      {
        accessorKey: 'league',
        header: 'League',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'matchup',
        header: 'Match Up',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'total',
        header: 'Stat',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'finalStat',
        header: 'Final Stat',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Odds',
        columns: [
          {
            accessorKey: 'overOdds',
            header: 'Over',
            cell: (info) => info.getValue(),
          },
          {
            accessorKey: 'underOdds',
            header: 'Under',
            cell: (info) => info.getValue(),
          },
        ],
      },

      {
        header: 'Exposure',
        columns: [
          {
            accessorKey: 'overExposure',
            header: 'Over',
            cell: (info) => {
              if (info.getValue() === 0) return info.getValue();

              const totalStake = info.row.original.betLegs
                .filter((leg) => leg.type === BetLegType.OVER_ODDS)
                .reduce((total, row) => total + row.stake, 0);

              return (
                <Link
                  component="button"
                  underline={'hover'}
                  onClick={() => {
                    setSelectedRow(info.row.original);
                    setSelectedBetLegType(BetLegType.OVER_ODDS);
                    handleOpen();
                  }}
                >
                  <span>
                    {info.getValue()} ({showDollarPrefix(totalStake, true)})
                  </span>
                </Link>
              );
            },
          },
          {
            accessorKey: 'underExposure',
            header: 'Under',
            cell: (info) => {
              if (info.getValue() === 0) return info.getValue();
              const totalStake = info.row.original.betLegs
                .filter((leg) => leg.type === BetLegType.UNDER_ODDS)
                .reduce((total, row) => total + row.stake, 0);

              return (
                <Link
                  component="button"
                  underline={'hover'}
                  onClick={() => {
                    setSelectedRow(info.row.original);
                    setSelectedBetLegType(BetLegType.UNDER_ODDS);
                    handleOpen();
                  }}
                >
                  <span>
                    {info.getValue()} ({showDollarPrefix(totalStake, true)})
                  </span>
                </Link>
              );
            },
          },
        ],
      },
      {
        accessorKey: 'gamedate',
        header: 'Game Date & Time',
        cell: (info) => {
          const { gamedate, gametime } = info.row.original;
          return dayjs(`${gamedate} ${gametime}`).format('YYYY-MM-DD HH:mm A');
        },
      },
      {
        accessorKey: 'status',
        header: 'Game Status',
        cell: (info) => info.getValue(),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns: columns || [],
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    enableSorting: true,
  });

  const { rows } = table.getRowModel();

  return (
    <div className={'flex flex-col gap-2 p-2'}>
      <div className={'flex flex-row gap-2 items-center'}>
        <TextField
          id="league"
          select
          label="Select league"
          size={'small'}
          value={selectedLeague}
          sx={{ width: 200 }}
          onChange={(e) => setSelectedLeague(e.target.value as League)}
        >
          <MenuItem key={'empty-league'} value={undefined}>
            <span className={'italic text-gray-400'}>Select league</span>
          </MenuItem>
          {Object.values(League).map((value: League) => (
            <MenuItem key={value} value={value}>
              {value.toUpperCase()}
            </MenuItem>
          ))}
        </TextField>

        <PickDatePickerRange
          dateRangeValue={dateRange}
          setDateRangeValue={setDateRange}
        />
      </div>
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
            <Typography variant="h5">Line Exposure</Typography>
          </Toolbar>
          <TableContainer component={Paper}>
            <Table aria-label="Line Exposure">
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableCell
                          key={header.id}
                          sortDirection={header.column.getIsSorted()}
                          sx={{
                            fontWeight: 'bold',
                            color: '#666666FF',
                            border: '1px solid rgba(224, 224, 224, 1)',
                          }}
                          align={'center'}
                          colSpan={header.colSpan}
                        >
                          {header.isPlaceholder ? null : (
                            <TableSortLabel
                              active={!!header.column.getIsSorted()}
                              direction={header.column.getIsSorted() || 'asc'}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <div
                                {...{
                                  className: header.column.getCanSort()
                                    ? 'cursor-pointer select-none'
                                    : '',
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                {header.column.getIsSorted() ? (
                                  <Box component="span" sx={visuallyHidden}>
                                    {header.column.getIsSorted() === 'desc'
                                      ? 'sorted descending'
                                      : 'sorted ascending'}
                                  </Box>
                                ) : null}
                              </div>
                            </TableSortLabel>
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
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell align="center" colSpan={13}>
                      <div
                        className={'flex flex-col justify-center items-center'}
                      >
                        <BrokenImageOutlinedIcon sx={{ fontSize: 75 }} />
                        No Data
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <LineExposureDetailsDialog
        open={open}
        handleClose={handleClose}
        betLegType={selectedBetLegType}
        row={selectedRow}
      />
    </div>
  );
}
