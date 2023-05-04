import React from 'react';
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtual } from 'react-virtual';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { Box, IconButton, Skeleton } from '@mui/material';
import { rankItem } from '@tanstack/match-sorter-utils';
import DebouncedInput from '~/components/ContestDetail/Entries/DebouncedInput';
import CustomNoRowsOverlay from '~/components/CustomDataTable/CustomNoRowsOverlay';
import AddIcon from '@mui/icons-material/Add';
import { LoadingSpinner } from '~/components/Cart/LoadingSpinner';
import { useWindowSize } from 'usehooks-ts';
import classNames from 'classnames';

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

interface PropsCustomDataTable {
  isLoading: boolean;
  flatData: any[];
  handleNew?: () => void;
  columns: ColumnDef<any, any>[];
  tableTitle: string;
  searchPlaceholder?: string;
  totalDBRowCount: number;
  totalFetched: number;
  isFetching: boolean;
  fetchNextPage: any;
  showSearchInput?: boolean;
  enableSorting?: boolean;
}

function CustomDataTable(props: PropsCustomDataTable) {
  const {
    isFetching,
    totalDBRowCount,
    totalFetched,
    fetchNextPage,
    flatData,
    columns,
    tableTitle,
    searchPlaceholder,
    isLoading,
    handleNew,
    showSearchInput = true,
    enableSorting = true,
  } = props;

  const windowSize = useWindowSize();

  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns: columns || [],
    state: {
      sorting,
      globalFilter,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    enableSorting,
  });

  const { rows } = table.getRowModel();

  //Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows } = rowVirtualizer;

  return (
    <div className={'h-full'}>
      {showSearchInput && (
        <div
          className={'flex flex-nowrap gap-2 justify-between my-2 items-center'}
        >
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder={`${searchPlaceholder || 'Search key'}`}
            debounce={200}
          />
          {!!handleNew && (
            <IconButton onClick={handleNew} color="primary">
              <AddIcon />
            </IconButton>
          )}
        </div>
      )}

      {isLoading ? (
        <Skeleton variant="rectangular" height={60} />
      ) : (
        <TableContainer
          component={Paper}
          sx={(theme) => ({
            height: windowSize.height * 0.6,
            maxHeight: windowSize.height * 0.6,
            [theme.breakpoints.up('xl')]: {
              height: windowSize.height * 0.8,
            },
            boxSizing: 'border-box',
          })}
          className={classNames({
            'overflow-y-hidden': virtualRows.length === 0,
            'overflow-auto': virtualRows.length !== 0,
          })}
        >
          <Box
            onScroll={(e) =>
              fetchMoreOnBottomReached(e.target as HTMLDivElement)
            }
            ref={tableContainerRef}
          >
            <Table aria-label={`${tableTitle} List`} stickyHeader>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableCell
                          key={header.id}
                          sortDirection={header.column.getIsSorted()}
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
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index] as Row<any>;
                  return (
                    <TableRow
                      key={row.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                      hover
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id}>
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
            </Table>

            {virtualRows.length === 0 && (
              <div className={'flex justify-center items-center h-full'}>
                <CustomNoRowsOverlay customMessage={`No ${tableTitle}`} />
              </div>
            )}
          </Box>
        </TableContainer>
      )}

      {isFetching && (
        <div className={'flex justify-center items-center mt-5'}>
          <LoadingSpinner /> Fetching data...
        </div>
      )}
    </div>
  );
}

export default CustomDataTable;
