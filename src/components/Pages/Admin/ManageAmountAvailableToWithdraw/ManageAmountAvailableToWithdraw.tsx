import React, { useEffect } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridToolbar,
  MuiEvent,
} from '@mui/x-data-grid';
import CustomNoEventsOverlay from '~/components/Pages/Admin/TournamentEvents/CustomNoEventsOverlay';
import LinearProgress from '@mui/material/LinearProgress';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

export type UserWalletRow = {
  id: string;
  username: string;
  balance: number;
  cashBalance: number;
  bonusCredits: number;
  amountAvailableToWithdraw: number;
};

interface Props {
  users: UserWalletRow[];
  isLoading: boolean;
  saveUserWallet: (userWallet: UserWalletRow) => void;
}

const ManageAmountAvailableToWithdraw = (props: Props) => {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );
  const [rows, setRows] = React.useState<GridRowsProp>([]);

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

  const save = (row: GridRowModel) => {
    props.saveUserWallet(row as UserWalletRow);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    save(updatedRow);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  useEffect(() => {
    setRows(props.users);
  }, [props.users]);

  return (
    <div className={'w-full h-[75vh]'}>
      <DataGrid
        loading={props.isLoading}
        slots={{
          noRowsOverlay: CustomNoEventsOverlay,
          loadingOverlay: LinearProgress,
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        rows={rows}
        getRowId={(row) => row.id}
        columns={[
          { field: 'id', flex: 2, headerName: 'ID' },
          { field: 'username', flex: 1, headerName: 'Username' },
          {
            field: 'cashBalance',
            flex: 1,
            headerName: 'Cash Balance',
            editable: true,
            type: 'number',
          },
          {
            field: 'bonusCredits',
            flex: 1,
            headerName: 'Bonus Credits',
            editable: true,
            type: 'number',
          },
          {
            field: 'balance',
            flex: 1,
            headerName: 'Total Balance',
            editable: true,
            type: 'number',
          },
          {
            field: 'amountAvailableToWithdraw',
            flex: 1,
            headerName: 'Amount Available to Withdraw',
            editable: true,
            type: 'number',
          },

          {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            cellClassName: 'actions',
            getActions: ({ id }) => {
              const isInEditMode =
                rowModesModel[id]?.mode === GridRowModes.Edit;

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
                  key={`edit-${id}`}
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={handleEditClick(id)}
                  color="inherit"
                />,
              ];
            },
          },
        ]}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
      />
    </div>
  );
};

export default ManageAmountAvailableToWithdraw;
