import React, { useEffect } from 'react';
import { TruncateCellContent } from '~/components/Pages/Admin/LineExposure/LineExposure';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridPreProcessEditCellProps,
  GridRenderCellParams,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridToolbar,
  GridValidRowModel,
  MuiEvent,
  useGridApiContext,
} from '@mui/x-data-grid';
import { darken, lighten, styled } from '@mui/material/styles';
import { LegRowModel, RowModel } from './PendingBetsManagement';
import { BetStatus } from '@prisma/client';
import { MenuItem, TextField } from '@mui/material';

const getBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .table-theme--WIN': {
    backgroundColor: getBackgroundColor(
      theme.palette.success.main,
      theme.palette.mode,
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.success.main,
          theme.palette.mode,
        ),
      },
    },
  },
  '& .table-theme--LOSS': {
    backgroundColor: getBackgroundColor(
      theme.palette.error.main,
      theme.palette.mode,
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode,
        ),
      },
    },
  },
  '& .table-theme--CANCELLED': {
    backgroundColor: getBackgroundColor(
      theme.palette.warning.main,
      theme.palette.mode,
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.warning.main,
          theme.palette.mode,
        ),
      },
    },
  },
  '& .table-theme--PUSH': {
    backgroundColor: getBackgroundColor(
      theme.palette.warning.main,
      theme.palette.mode,
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.warning.main,
          theme.palette.mode,
        ),
      },
    },
  },
  '& .table-theme--REFUNDED': {
    backgroundColor: getBackgroundColor(
      theme.palette.warning.main,
      theme.palette.mode,
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.warning.main,
          theme.palette.mode,
        ),
      },
    },
  },
}));

function StatusEditInputCell(props: GridRenderCellParams<any, number>) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <TextField
      id="status"
      select
      fullWidth
      size={'small'}
      value={value}
      onChange={handleChange}
    >
      <MenuItem key={'empty-status'} value={undefined} disabled>
        <em>Select status</em>
      </MenuItem>
      {Object.values(BetStatus).map((value) => (
        <MenuItem
          key={value}
          value={value}
          disabled={
            value === BetStatus.CANCELLED || value === BetStatus.REFUNDED
          }
        >
          {value}
        </MenuItem>
      ))}
    </TextField>
  );
}

const renderStatusEditInputCell: GridColDef['renderCell'] = (params) => {
  return <StatusEditInputCell {...params} />;
};

export interface BetLegRowModel extends GridValidRowModel {
  id: string;
  name: string;
  type: string;
  odds: number;
  category: string;
  total: number;
  total_stat: number | null;
  status: string;
}

interface Props {
  betRow?: RowModel;
  updateBetLeg: (leg: LegRowModel, status: BetStatus) => void;
}

export default function BetLegsTable({ betRow, updateBetLeg }: Props) {
  const [rows, setRows] = React.useState<GridRowsProp<BetLegRowModel>>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );

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
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow: GridValidRowModel) => {
    const betLeg = newRow as BetLegRowModel;

    setRows(rows.map((row) => (row.id === betLeg.id ? betLeg : row)));

    updateBetLeg(betLeg, betLeg.status as BetStatus);

    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      flex: 1,
      headerName: 'Leg ID',
      renderCell: (params) => {
        const currentRow = params.row as (typeof rows)[0];
        return <TruncateCellContent value={currentRow?.id as string} />;
      },
    },
    {
      field: 'name',
      flex: 1,
      headerName: 'Name',
    },
    {
      field: 'type',
      flex: 1,
      headerName: 'Type',
    },
    {
      field: 'category',
      flex: 1,
      headerName: 'Category',
    },
    {
      field: 'odds',
      flex: 1,
      headerName: 'Odds',
    },
    {
      field: 'total',
      flex: 1,
      headerName: 'Total',
      renderCell: (params) => {
        const leg = params.row as (typeof rows)[0];
        return leg.total?.toFixed(2);
      },
    },
    {
      field: 'total_stat',
      flex: 1,
      headerName: 'Final Stat',
      renderCell: (params) => {
        const leg = params.row as (typeof rows)[0];
        return leg.total_stat === null ? '' : leg.total_stat?.toFixed(2);
      },
    },
    {
      flex: 1,
      field: 'status',
      headerName: 'Status',
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        return {
          ...params.props,
          error: !params.props.value
            ? 'Please enter a valid projected stat'
            : null,
        };
      },
      renderEditCell: renderStatusEditInputCell,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={'saveButton'}
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={'cancelButton'}
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
            key={'editButton'}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    if (betRow) {
      const betLegs = betRow.legs as BetLegRowModel[];
      setRows(betLegs);
    }
  }, [betRow]);

  return (
    <div style={{ height: 300, width: '100%' }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        getRowClassName={(params) => `table-theme--${params.row.status}`}
        processRowUpdate={processRowUpdate}
        hideFooter
        hideFooterSelectedRowCount
        disableColumnSelector
        disableDensitySelector
        initialState={{
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: [],
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
    </div>
  );
}
