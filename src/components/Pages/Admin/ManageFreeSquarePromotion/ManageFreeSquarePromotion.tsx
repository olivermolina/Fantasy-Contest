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
import { Button, MenuItem, TextField } from '@mui/material';
import { ContestCategory, League } from '@prisma/client';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import { TruncateCellContent } from '~/components/Pages/Admin/LineExposure/LineExposure';
import type { FantasyCardFreeSquareProps } from '~/components/FantasyPicker/FantasyCard';
import EditFreeSquarePromotionDialog, {
  AddFreeSquarePromotionInput,
} from './EditFreeSquarePromotionDialog';
import DebouncedInput from '~/components/ContestDetail/Entries/DebouncedInput';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

export interface ManageFreeSquarePromotionRowModel {
  /**
   * ID of the market
   */
  id: string;
  /**
   * Market selId
   */
  selId: number;
  /**
   * One of the supported league enums in the application
   * @example NBA
   */
  league: string;
  /**
   * Player Name
   * @example Ja Morant
   */
  playerName: string;
  /**
   * Player Stat category
   * @example Assists
   */
  statName: string;
  /**
   * Total stat offer
   * @example 10
   */
  total: number;
  /**
   * Game date & time
   * @example '2022-10-02 13:35:01',
   */
  matchTime: string;
  /**
   * Team name matchup
   * @example '2022-10-02 13:35:01',
   */
  matchName: string;
  /**
   * Free square object
   */
  freeSquare: FantasyCardFreeSquareProps | null;
  /**
   * Free square discount
   */
  freeSquareDiscount: number;
  /**
   * Discounted projection total
   */
  discountedTotal: number;
  /**
   * # of picks array converted to string
   */
  picksCategory: string;
  /**
   * Boolean to check if it can be used in a free entry
   */
  freeEntryEnabled: boolean;
  /**
   * Maximum stake amount
   */
  maxStake: number;
}

interface ManageFreeSquarePromotionProps {
  /**
   * ManageFreeSquarePromotion data
   */
  data: ManageFreeSquarePromotionRowModel[];
  /**
   * The selected league to filter the table
   * @example NBA
   */
  selectedLeague: League;
  /**
   * Callback function to filter the league
   */
  setSelectedLeague: React.Dispatch<React.SetStateAction<League>>;
  /**
   * Available contest pick categories in the system
   */
  contestCategories: ContestCategory[];
  /**
   * Callback function to save the free square promotion discount
   */
  handleSave: (formData: AddFreeSquarePromotionInput) => void;
  /**
   * Callback function to remove free square promotion discount
   */
  handleDelete: (id: string) => void;
}

export default function ManageFreeSquarePromotion(
  props: ManageFreeSquarePromotionProps,
) {
  const { setSelectedLeague, selectedLeague, data, handleDelete } = props;
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [open, setOpen] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectedRow, setSelectedRow] = useState<
    ManageFreeSquarePromotionRowModel | undefined
  >(undefined);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(undefined);
  };

  const columns = useMemo<ColumnDef<ManageFreeSquarePromotionRowModel>[]>(
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
        accessorKey: 'playerName',
        header: 'Player name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'statName',
        header: 'Stat name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'matchTime',
        header: 'Match DateTime',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'matchName',
        header: 'Match Up',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'total',
        header: 'Total Stat',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'freeSquareDiscount',
        header: 'Free Square Discount',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'discountedTotal',
        header: 'Discounted Total',
        cell: (info) => Number(info.getValue()).toFixed(2),
      },
      {
        accessorKey: 'maxStake',
        header: 'Max Stake/Bet',
        cell: (info) => Number(info.getValue()).toFixed(2),
      },
      {
        accessorKey: 'picksCategory',
        header: '# of Players',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'freeEntryEnabled',
        header: 'Can use bonus credit (Free Entry)',
        cell: (info) => (info.getValue() ? 'TRUE' : ''),
      },
      {
        header: 'Action',
        cell: (info) => {
          return (
            <div className={'flex justify-around gap-1'}>
              <Button
                variant={'outlined'}
                size={'small'}
                onClick={() => {
                  setSelectedRow(info.row.original);
                  handleOpen();
                }}
              >
                Edit
              </Button>
              <Button
                variant={'contained'}
                size={'small'}
                onClick={async () => {
                  if (info.row.original.freeSquare) {
                    setSelectedRow(info.row.original);
                    setOpenDeleteConfirmation(true);
                  }
                }}
              >
                Remove
              </Button>
            </div>
          );
        },
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
      <div className={'flex flex-row gap-2 items-center justify-between'}>
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

        <div className={'max-w-lg'}>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => {
              setGlobalFilter(String(value));
            }}
            placeholder={'Search'}
            debounce={200}
          />
        </div>
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
            <Typography variant="h5">Free Square Promotions</Typography>
          </Toolbar>
          <TableContainer component={Paper}>
            <Table aria-label="Free Square Promotions">
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
      <EditFreeSquarePromotionDialog
        handleClose={handleClose}
        open={open}
        row={selectedRow}
        contestCategories={props.contestCategories}
        handleSave={props.handleSave}
      />
      <DeleteConfirmationDialog
        open={openDeleteConfirmation}
        setOpen={setOpenDeleteConfirmation}
        freeSquareId={selectedRow?.freeSquare?.id}
        handleDelete={handleDelete}
      />
    </div>
  );
}
