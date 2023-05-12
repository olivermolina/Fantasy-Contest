import React from 'react';
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RowModel } from './PendingBetsManagement';
import { BetStatus } from '@prisma/client';

const PendingPickTable = (props: { row?: RowModel }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Pending Pick table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Odds</TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.row?.legs.map((leg) => (
            <TableRow
              key={leg.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {leg.name}
              </TableCell>
              <TableCell align="center">{leg.type}</TableCell>
              <TableCell align="center">{leg.odds}</TableCell>
              <TableCell align="center">{leg.category}</TableCell>
              <TableCell align="center">{leg.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface Props {
  /**
   * Close dialog callback function
   */
  handleClose: () => void;
  /**
   * Delete pending pick callback function
   */
  onClickDeleteRow: (currentRow: RowModel, betStatus: BetStatus) => unknown;
  /**
   * Boolean to show dialog
   * @example true
   */
  open: boolean;
  /**
   * Pending pick table row model
   */
  row?: RowModel;
  /**
   * Clear selected table row callback function
   */
  clearSelectedRow: () => void;
  /**
   * Boolean to view only the pick legs
   */
  isViewOnly: boolean;
  /**
   * Bet status
   */
  betStatus?: BetStatus;
}

export default function PendingPickDialog(props: Props) {
  const {
    handleClose,
    open,
    onClickDeleteRow,
    row,
    clearSelectedRow,
    isViewOnly,
    betStatus,
  } = props;
  const confirmAction = () => {
    if (row && betStatus) {
      onClickDeleteRow(row, betStatus);
      clearSelectedRow();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'lg'}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            {betStatus === BetStatus.REFUNDED &&
              `Are you sure you want to REFUND this pick?`}
            {betStatus &&
              betStatus !== BetStatus.REFUNDED &&
              `Are you sure you want to settle the pick status to ${betStatus}?`}
            {!betStatus && `${row?.legs.length} Picks`}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={'flex flex-col gap-2 p-2'}>
        <div
          className={
            'grid grid-cols-1 gap-x-1 lg:grid-cols-2 lg:gap-x-2 divide-y divide-dashed border-b'
          }
        >
          <div className={'flex flex-row justify-start items-center gap-2 p-2'}>
            <span className={'font-semibold w-28'}>Ticket</span>
            <TextField
              variant={'outlined'}
              size={'small'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={row?.ticket}
            />
          </div>

          <div className={'flex flex-row justify-start items-center gap-2 p-2'}>
            <span className={'font-semibold w-28'}>Risk/Win</span>
            <TextField
              variant={'outlined'}
              size={'small'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={row?.riskWin}
            />
          </div>

          <div className={'flex flex-row justify-start items-center gap-2 p-2'}>
            <span className={'font-semibold w-28'}>Username</span>
            <TextField
              variant={'outlined'}
              size={'small'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={row?.username}
            />
          </div>
          <div className={'flex flex-row justify-start items-center gap-2 p-2'}>
            <span className={'font-semibold w-28'}>Name</span>
            <TextField
              variant={'outlined'}
              size={'small'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={row?.name}
            />
          </div>
          <div className={'flex flex-row justify-start items-center gap-2 p-2'}>
            <span className={'font-semibold w-28'}>Type</span>
            <TextField
              variant={'outlined'}
              size={'small'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={row?.type}
            />
          </div>
          <div className={'flex flex-row justify-start items-center gap-2 p-2'}>
            <span className={'font-semibold w-28'}>Status</span>
            <TextField
              variant={'outlined'}
              size={'small'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={row?.status}
            />
          </div>
        </div>
        <PendingPickTable row={row} />{' '}
        {!isViewOnly && (
          <div className={'flex justify-center'}>
            <Button
              color="warning"
              autoFocus
              onClick={confirmAction}
              variant="contained"
              sx={{ maxWidth: 100 }}
            >
              Confirm
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
