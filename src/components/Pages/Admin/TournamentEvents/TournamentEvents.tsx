import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import {
  DataGrid,
  GRID_DATE_COL_DEF,
  GRID_DATETIME_COL_DEF,
  GridActionsCellItem,
  GridCellParams,
  GridColDef,
  GridColTypeDef,
  GridEventListener,
  GridFilterInputValueProps,
  GridFilterItem,
  GridRenderEditCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  MuiEvent,
  useGridApiContext,
} from '@mui/x-data-grid';
import PickDatePickerRange from '~/components/Picks/PickDatePickerRange';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Dialog, IconButton, LinearProgress } from '@mui/material';
import CustomNoEventsOverlay from '~/components/Pages/Admin/TournamentEvents/CustomNoEventsOverlay';
import { randomId } from '@mui/x-data-grid-generator';
import { League, Offer, Team, TournamentEvent } from '@prisma/client';
import { TournamentEventInput } from '~/schemas/TournamentEventSchema';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { MarketWithPlayerTeam } from '~/components/Admin/Market/Markets';
import Tooltip from '@mui/material/Tooltip';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { TextFieldProps } from '@mui/material/TextField';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

function buildApplyDateFilterFn(
  filterItem: GridFilterItem,
  compareFn: (value1: number, value2: number) => boolean,
  showTime = false,
) {
  if (!filterItem.value) {
    return null;
  }

  // Make a copy of the date to not reset the hours in the original object
  const filterValueCopy = new Date(filterItem.value);
  filterValueCopy.setHours(0, 0, 0, 0);

  const filterValueMs = filterValueCopy.getTime();

  return ({ value }: GridCellParams<any, Date>): boolean => {
    if (!value) {
      return false;
    }

    // Make a copy of the date to not reset the hours in the original object
    const dateCopy = new Date(value);
    dateCopy.setHours(
      showTime ? value.getHours() : 0,
      showTime ? value.getMinutes() : 0,
      0,
      0,
    );
    const cellValueMs = dateCopy.getTime();

    return compareFn(cellValueMs, filterValueMs);
  };
}

function getDateFilterOperators(
  showTime = false,
): GridColTypeDef['filterOperators'] {
  return [
    {
      value: 'is',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 === value2,
          showTime,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
    },
    {
      value: 'not',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 !== value2,
          showTime,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
    },
    {
      value: 'after',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 > value2,
          showTime,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
    },
    {
      value: 'onOrAfter',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 >= value2,
          showTime,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
    },
    {
      value: 'before',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 < value2,
          showTime,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
    },
    {
      value: 'onOrBefore',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 <= value2,
          showTime,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
    },
    {
      value: 'isEmpty',
      getApplyFilterFn: () => {
        return ({ value }): boolean => {
          return value == null;
        };
      },
      requiresFilterValue: false,
    },
    {
      value: 'isNotEmpty',
      getApplyFilterFn: () => {
        return ({ value }): boolean => {
          return value != null;
        };
      },
      requiresFilterValue: false,
    },
  ];
}

const dateAdapter = new AdapterDayjs({ locale: 'en' });

/**
 * `Date` column type
 */

const DateColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getDateFilterOperators(),
  valueFormatter: (params) => {
    if (typeof params.value === 'string') {
      return params.value;
    }
    if (params.value) {
      return dateAdapter.format(dayjs(params.value), 'keyboardDate');
    }
    return '';
  },
};

const GridEditDateInput = styled(InputBase)({
  fontSize: 'inherit',
  padding: '0 9px',
});

function WrappedGridEditDateInput(props: TextFieldProps) {
  const { InputProps, ...other } = props;
  return (
    <GridEditDateInput
      fullWidth
      {...InputProps}
      {...(other as InputBaseProps)}
    />
  );
}

function GridEditDateCell({
  id,
  field,
  value,
  colDef,
}: GridRenderEditCellParams<any, Date | string | null>) {
  const apiRef = useGridApiContext();

  const Component = colDef.type === 'dateTime' ? DateTimePicker : DatePicker;

  const handleChange = (newValue: unknown) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Component
      value={dayjs(value)}
      autoFocus
      onChange={handleChange}
      slots={{ textField: WrappedGridEditDateInput }}
    />
  );
}

function GridFilterDateInput(
  props: GridFilterInputValueProps & {
    showTime?: boolean;
  },
) {
  const { item, showTime, applyValue, apiRef } = props;

  const Component = showTime ? DateTimePicker : DatePicker;

  const handleFilterChange = (newValue: unknown) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Component
      value={item.value || null}
      autoFocus
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      slotProps={{
        textField: {
          variant: 'standard',
        },
        inputAdornment: {
          sx: {
            '& .MuiButtonBase-root': {
              marginRight: -1,
            },
          },
        },
      }}
      onChange={handleFilterChange}
    />
  );
}

/**
 * `DateTime` column
 */

export const DateTimeColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATETIME_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getDateFilterOperators(true),
  valueFormatter: (params) => {
    if (typeof params.value === 'string') {
      return params.value;
    }
    if (params.value) {
      return dateAdapter.format(dayjs(params.value), 'keyboardDateTime');
    }
    return '';
  },
};

export type TournamentEventWithOfferMarkets = TournamentEvent & {
  Offers: (Offer & {
    markets: MarketWithPlayerTeam[];
    home: Team;
    away: Team;
  })[];
};

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
  from: Date;
  to: Date;
}

function EditToolbar(props: EditToolbarProps) {
  const router = useRouter();
  const { setRows, setRowModesModel, from, to } = props;

  const handleNew = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', created_at: new Date(), league: League.NBA, isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

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
        <GridToolbarQuickFilter />
        <IconButton onClick={handleNew} color="primary">
          <AddIcon />
        </IconButton>
      </GridToolbarContainer>
    </div>
  );
}

interface Props {
  data: TournamentEventWithOfferMarkets[];
  from: Date;
  to: Date;
  handleSaveEvent: (data: TournamentEventInput) => void;
  isLoading: boolean;
  handleDeleteEvent: (id: string) => any;
  handleSelectTournamentEvent: (row: TournamentEventWithOfferMarkets) => void;
  handleCopyTournamentEvent: (id: string) => void;
}

const TournamentEvents = (props: Props) => {
  const {
    data,
    from,
    to,
    isLoading,
    handleSaveEvent,
    handleDeleteEvent,
    handleSelectTournamentEvent,
    handleCopyTournamentEvent,
  } = props;

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );
  const [rows, setRows] = React.useState<GridRowsProp>(data);
  const [selectedRowId, setSelectedRowId] = React.useState<GridRowId | null>(
    null,
  );

  const noButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setSelectedRowId(id);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = {
      ...newRow,
      isNew: false,
    };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    handleSaveEvent(newRow as TournamentEventInput);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      flex: 1,
      headerName: 'Event ID',
    },
    {
      field: 'name',
      flex: 1,
      headerName: 'Event Name',
      editable: true,
    },
    {
      field: 'league',
      flex: 1,
      headerName: 'League',
      editable: true,
      type: 'singleSelect',
      valueOptions: Object.keys(League),
    },
    {
      field: 'updated_at',
      ...DateColumnType,
      flex: 1,
      headerName: 'Date',
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`save-${id}`}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`cancel-${id}`}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={`view-${id}`}
            icon={
              <Tooltip title="View Offers">
                <VisibilityIcon />
              </Tooltip>
            }
            label="View Matches"
            color="inherit"
            onClick={() =>
              handleSelectTournamentEvent(
                rows.find(
                  (row) => row.id === id,
                ) as TournamentEventWithOfferMarkets,
              )
            }
          />,
          <GridActionsCellItem
            key={`copy-${id}`}
            icon={
              <Tooltip title="Copy Tournament Event">
                <ContentCopyIcon />
              </Tooltip>
            }
            label="Copy Tournament Event"
            color="inherit"
            onClick={() => handleCopyTournamentEvent(id.toString())}
          />,
          <GridActionsCellItem
            key={`edit-${id}`}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`delete-${id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };

  const handleYes = async () => {
    const response = await handleDeleteEvent(selectedRowId as string);
    if (response) {
      setRows(rows.filter((row) => row.id !== selectedRowId));
    }
    setSelectedRowId(null);
  };

  const handleClose = () => {
    setSelectedRowId(null);
  };

  useEffect(() => {
    setRows(data);
  }, [data]);

  return (
    <div className={'h-[75vh] w-full'}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DataGrid
          slots={{
            noRowsOverlay: CustomNoEventsOverlay,
            loadingOverlay: LinearProgress,
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: {
              setRows,
              setRowModesModel,
              from,
              to,
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          rows={rows}
          getRowId={(row) => row.id}
          loading={isLoading}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
        />
      </LocalizationProvider>
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={selectedRowId !== null}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          {`Pressing 'Yes' will remove the event '${
            rows.find((row) => row.id === selectedRowId)?.name
          }'`}
        </DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleClose} variant={'outlined'}>
            No
          </Button>
          <Button onClick={handleYes} variant={'contained'}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TournamentEvents;
