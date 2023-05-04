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
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RowModel } from './PendingBetsManagement';

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
              <TableCell align="center">{leg.total}</TableCell>
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
  onClickDeleteRow: (currentRow: RowModel) => unknown;
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
}

export default function PendingPickDialog(props: Props) {
  const {
    handleClose,
    open,
    onClickDeleteRow,
    row,
    clearSelectedRow,
    isViewOnly,
  } = props;
  const handleDeleteRow = () => {
    if (row) {
      onClickDeleteRow(row);
      clearSelectedRow();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'lg'}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Pick Legs
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
        <PendingPickTable row={row} />{' '}
        {!isViewOnly && (
          <div className={'flex justify-center'}>
            <Button
              color="warning"
              autoFocus
              onClick={handleDeleteRow}
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
