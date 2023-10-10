import React from 'react';
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LegRowModel, RowModel } from './PendingBetsManagement';
import { BetStatus } from '@prisma/client';
import BetLegsTable from '~/components/Pages/Admin/PendingBetsManagement/BetLegsTable';

interface Props {
  /**
   * Close dialog callback function
   */
  handleClose: () => void;
  /**
   * Settle pick callback function
   * @param currentRow
   * @param betStatus
   */
  settlePick: (currentRow: RowModel, betStatus: BetStatus) => unknown;
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
   * Bet status
   */
  betStatus?: BetStatus;
  /**
   * Set bet status callback function
   * @param betStatus
   */
  setSelectedBetStatus: (betStatus: BetStatus) => void;
  /**
   * Update bet leg callback function
   * @param leg
   */
  updateBetLeg: (leg: LegRowModel, betStatus: BetStatus) => void;
}

export default function PendingPickDialog(props: Props) {
  const {
    handleClose,
    open,
    settlePick,
    row,
    clearSelectedRow,
    betStatus,
    setSelectedBetStatus,
  } = props;
  const confirmAction = () => {
    if (row && betStatus) {
      settlePick(row, betStatus);
      clearSelectedRow();
    }
  };

  const handleBetStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.value;
    setSelectedBetStatus(newValue as BetStatus);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'lg'}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            {row?.legs.length} Picks
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
              id="status"
              select
              fullWidth
              size={'small'}
              value={betStatus || ''}
              onChange={handleBetStatusChange}
            >
              <MenuItem key={'empty-status'} value={undefined} disabled>
                <em>Select status</em>
              </MenuItem>
              {[
                BetStatus.WIN,
                BetStatus.PENDING,
                BetStatus.LOSS,
                BetStatus.CANCELLED,
                BetStatus.REFUNDED,
              ].map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>
        <BetLegsTable betRow={row} updateBetLeg={props.updateBetLeg} />
        <div className={'flex justify-center gap-2'}>
          <Button
            variant={'outlined'}
            onClick={handleClose}
            sx={{ minWidth: 100 }}
          >
            Close
          </Button>
          <Button
            color="primary"
            autoFocus
            onClick={confirmAction}
            variant="contained"
            sx={{ minWidth: 100 }}
            disabled={!betStatus || betStatus === row?.status}
          >
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
