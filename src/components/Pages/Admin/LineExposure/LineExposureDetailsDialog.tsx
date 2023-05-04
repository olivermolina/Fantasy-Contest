import React, { useMemo } from 'react';
import {
  AppBar,
  Dialog,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ILineExposure } from '~/server/routers/admin/getLineExposures';
import { BetLegType } from '@prisma/client';
import { showDollarPrefix } from '~/utils/showDollarPrefix';
import { TruncateCellContent } from '~/components/Pages/Admin/LineExposure/LineExposure';

interface Props {
  /**
   * Close dialog callback function
   */
  handleClose: () => void;
  /**
   * Boolean to show dialog
   * @example true
   */
  open: boolean;
  /**
   * Pending pick table row model
   */
  row?: ILineExposure;
  /**
   * Bet leg type
   * @example UNDER_ODDS
   */
  betLegType?: BetLegType;
}

export default function LineExposureDetailsDialog(props: Props) {
  const { handleClose, open, row, betLegType } = props;
  const totalStake = useMemo(
    () =>
      row?.betLegs
        .filter((leg) => leg.type === betLegType)
        .reduce((total, row) => total + row.stake, 0) || 0,
    [row, betLegType],
  );
  const totalPayouts = useMemo(
    () =>
      row?.betLegs
        .filter((leg) => leg.type === betLegType)
        .reduce((total, row) => total + row.payout, 0) || 0,
    [row, betLegType],
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'lg'}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Line Exposure Details
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={'flex flex-col gap-2 p-2'}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Line Exposure Details">
            <TableHead>
              <TableRow>
                <TableCell align="center">Bet ID</TableCell>
                <TableCell align="center">Leg ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Placed Date</TableCell>
                <TableCell align="center">Leg Type</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Stake</TableCell>
                <TableCell align="center">Payout</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row?.betLegs
                ?.filter((leg) => leg.type === betLegType)
                .map((leg) => (
                  <TableRow
                    key={leg.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="center">
                      <TruncateCellContent value={leg.betId} />
                    </TableCell>
                    <TableCell align="center">
                      <TruncateCellContent value={leg.id} />
                    </TableCell>
                    <TableCell align="center">
                      {leg.user.firstName && leg.user.lastName
                        ? `${leg.user.firstName} ${leg.user.lastName}`
                        : leg.user.username}
                    </TableCell>
                    <TableCell align="center">{leg.entryDate}</TableCell>
                    <TableCell align="center">{leg.type}</TableCell>
                    <TableCell align="center">{leg.status}</TableCell>
                    <TableCell align="center">
                      {showDollarPrefix(leg.stake, true)}
                    </TableCell>
                    <TableCell align="center">
                      {showDollarPrefix(leg.payout, true)}
                    </TableCell>
                  </TableRow>
                ))}

              <TableRow>
                <TableCell align="right" colSpan={6}>
                  <span className={'text-md font-bold'}>Total: </span>
                </TableCell>
                <TableCell align="center">
                  <span className={'text-md font-bold'}>
                    {showDollarPrefix(totalStake, true)}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <span className={'text-md font-bold'}>
                    {showDollarPrefix(totalPayouts, true)}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Dialog>
  );
}
