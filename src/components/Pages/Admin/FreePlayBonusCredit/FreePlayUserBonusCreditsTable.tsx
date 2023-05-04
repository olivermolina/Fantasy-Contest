import React, { useMemo, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridSlotsComponentsProps,
} from '@mui/x-data-grid';
import { Button, Stack } from '@mui/material';
import CancelFreePlayConfirmDialog from '~/components/Pages/Admin/FreePlayBonusCredit/CancelFreePlayConfirmDialog';
import { TransactionType } from '@prisma/client';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';

declare module '@mui/x-data-grid' {
  interface FooterPropsOverrides {
    totalBonusCredits: number;
  }
}

type Props = {
  onSubmitDeletePlayFreeCredit(currentRow: FreePlayRowModel): unknown;
  data: readonly FreePlayRowModel[];
};

export interface FreePlayRowModel {
  id: string;
  transactionDate: Date;
  amountBonus: number;
  status: PaymentStatusCode;
  type: TransactionType;
}

function CustomFooter(props: NonNullable<GridSlotsComponentsProps['footer']>) {
  return (
    <div className={'flex p-2 font-semibold text-lg'}>
      Total Bonus Credits: {Number(props.totalBonusCredits).toFixed(2)}
    </div>
  );
}

export default function FreePlayUserBonusCreditsTable(props: Props) {
  const rows: GridRowsProp<FreePlayRowModel> = props.data;
  const [selectedRow, setSelectedRow] = useState<
    FreePlayRowModel | undefined
  >();
  const [open, setOpen] = useState(false);

  const columns: GridColDef[] = [
    { flex: 1, field: 'id', headerName: 'Transaction ID' },
    {
      flex: 1,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      valueFormatter: (params) => params.value.toLocaleString(),
    },
    { flex: 1, field: 'type', headerName: 'Type' },
    { flex: 1, field: 'amountBonus', headerName: 'Amount' },
    {
      flex: 1,
      field: 'status',
      headerName: 'Status',
      renderCell: (params) => {
        const currentRow = params.row as typeof rows[0];
        return Object.keys(PaymentStatusCode)[
          Object.values(PaymentStatusCode).indexOf(currentRow.status as number)
        ];
      },
    },
    {
      flex: 1,
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => {
        const currentRow = params.row as typeof rows[0];
        const onClick = () => {
          setSelectedRow(currentRow);
          setOpen(true);
        };

        return (
          <Stack direction="row" spacing={2}>
            <Button
              color="warning"
              size="small"
              onClick={onClick}
              variant={'contained'}
              disabled={currentRow.status !== PaymentStatusCode.COMPLETE}
            >
              Cancel
            </Button>
          </Stack>
        );
      },
    },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const deleteBonusCredit = (row: FreePlayRowModel) => {
    props.onSubmitDeletePlayFreeCredit(row);
    handleClose();
  };

  const totalBonusCredits = useMemo(
    () =>
      props.data.reduce(
        (acc, curr) =>
          curr.status === PaymentStatusCode.COMPLETE
            ? curr.type === TransactionType.CREDIT
              ? acc + curr.amountBonus
              : acc - curr.amountBonus
            : acc,
        0,
      ),
    [props.data],
  );

  return (
    <div className="flex flex-col gap-2">
      <span className={'text-lg font-bold'}>Bonus Credit Transactions</span>
      <div style={{ height: 300, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.id}
          rows={rows}
          columns={columns}
          slots={{
            footer: CustomFooter,
          }}
          slotProps={{
            footer: { totalBonusCredits },
          }}
        />
        <CancelFreePlayConfirmDialog
          open={open}
          setOpen={setOpen}
          handleDelete={deleteBonusCredit}
          row={selectedRow}
        />
      </div>
    </div>
  );
}
