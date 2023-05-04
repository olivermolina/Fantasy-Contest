import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Button, Stack } from '@mui/material';
import PendingPickDialog from './PendingPickDialog';

type Props = {
  onClickDeleteRow(currentRow: RowModel): unknown;
  data: readonly RowModel[];
};

export interface RowModel {
  ticket: string;
  placed: Date;
  userPhone: string;
  username: string;
  description: string;
  riskWin: string;
  legs: {
    id: string;
    name: string;
    type: string;
    odds: number;
    category: string;
    total: number;
  }[];
}

export const PendingBetsManagement = (props: Props) => {
  const rows: GridRowsProp<RowModel> = props.data;
  const [selectedRow, setSelectedRow] = useState<RowModel | undefined>();
  const [open, setOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(true);

  const columns: GridColDef[] = [
    { flex: 1, field: 'ticket', headerName: 'Ticket #' },
    {
      flex: 1,
      field: 'placed',
      headerName: 'Placed',
      valueFormatter: (params) => params.value.toLocaleString(),
    },
    { flex: 1, field: 'userPhone', headerName: 'User/Phone' },
    { flex: 1, field: 'username', headerName: 'Username' },
    {
      flex: 1,
      field: 'description',
      headerName: 'Description',
    },
    { flex: 1, field: 'riskWin', headerName: 'Risk/Win' },
    {
      flex: 1,
      field: 'view',
      headerName: 'Legs',
      renderCell: (params) => {
        const onClick = () => {
          const currentRow = params.row as typeof rows[0];
          setSelectedRow(currentRow);
          setOpen(true);
          setIsViewOnly(true);
        };

        return (
          <Stack direction="row" spacing={2}>
            <Button
              color="primary"
              size="small"
              onClick={onClick}
              variant="outlined"
            >
              View
            </Button>
          </Stack>
        );
      },
    },
    {
      flex: 1,
      field: 'delete',
      headerName: 'Delete',
      renderCell: (params) => {
        const onClick = () => {
          const currentRow = params.row as typeof rows[0];
          setSelectedRow(currentRow);
          setOpen(true);
          setIsViewOnly(false);
        };

        return (
          <Stack direction="row" spacing={2}>
            <Button
              color="warning"
              size="small"
              onClick={onClick}
              variant={'contained'}
            >
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];

  const clearSelectedRow = () => {
    setSelectedRow(undefined);
    handleClose();
  };
  const handleClose = () => {
    setOpen(false);
    setIsViewOnly(true);
  };

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid getRowId={(row) => row.ticket} rows={rows} columns={columns} />
      <PendingPickDialog
        onClickDeleteRow={props.onClickDeleteRow}
        clearSelectedRow={clearSelectedRow}
        open={open}
        row={selectedRow}
        handleClose={handleClose}
        isViewOnly={isViewOnly}
      />
    </div>
  );
};
