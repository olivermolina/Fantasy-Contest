import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Button, Stack } from '@mui/material';
import PendingPickDialog from './PendingPickDialog';
import { BetStatus } from '@prisma/client';

type Props = {
  settlePick(currentRow: RowModel, betStatus: BetStatus): unknown;
  data: readonly RowModel[];
  updateBetLeg: (leg: LegRowModel, status: BetStatus) => void;
};

export interface LegRowModel {
  id: string;
  name: string;
  type: string;
  odds: number;
  category: string;
  total: number;
  total_stat: number | null;
  status: string;
}

export interface RowModel {
  ticket: string;
  placed: Date;
  userPhone: string;
  status: string;
  name: string;
  username: string;
  description: string;
  riskWin: string;
  type: string;
  legs: LegRowModel[];
}

export const PendingBetsManagement = (props: Props) => {
  const rows: GridRowsProp<RowModel> = props.data;
  const [selectedRow, setSelectedRow] = useState<RowModel | undefined>();
  const [betStatus, setBetStatus] = useState<BetStatus | undefined>();
  const [open, setOpen] = useState(false);

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
          const currentRow = params.row as (typeof rows)[0];
          setSelectedRow(currentRow);
          setBetStatus(currentRow.status as BetStatus);
          setOpen(true);
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
      flex: 2,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params) => {
        const onClick = (betStatus: BetStatus) => {
          const currentRow = params.row as (typeof rows)[0];
          setSelectedRow(currentRow);
          setOpen(true);
          setBetStatus(betStatus);
        };

        return (
          <div className={'flex gap-1'}>
            <Button
              color="warning"
              size="small"
              onClick={() => onClick(BetStatus.WIN)}
              variant={'contained'}
            >
              WIN
            </Button>
            <Button
              color="warning"
              size="small"
              onClick={() => onClick(BetStatus.LOSS)}
              variant={'contained'}
            >
              LOSS
            </Button>
            <Button
              color="warning"
              size="small"
              onClick={() => onClick(BetStatus.REFUNDED)}
              variant={'contained'}
            >
              Refund
            </Button>
          </div>
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
  };

  const setSelectedBetStatus = (betStatus: BetStatus) => {
    setBetStatus(betStatus);
  };

  return (
    <div className={'h-[75vh] lg:h-[80vh] w-full'}>
      <DataGrid getRowId={(row) => row.ticket} rows={rows} columns={columns} />
      <PendingPickDialog
        settlePick={props.settlePick}
        clearSelectedRow={clearSelectedRow}
        open={open}
        row={selectedRow}
        handleClose={handleClose}
        betStatus={betStatus}
        setSelectedBetStatus={setSelectedBetStatus}
        updateBetLeg={props.updateBetLeg}
      />
    </div>
  );
};
