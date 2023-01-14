import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SessionExpiredDialog = (props: Props) => {
  const { open, setOpen } = props;
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    router.reload();
  };
  return (
    <Dialog open={open}>
      <DialogTitle sx={{ m: 0 }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <Typography>
          Deposit session has expired. Please refresh the current page.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiredDialog;
