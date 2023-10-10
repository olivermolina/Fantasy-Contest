import * as React from 'react';
import { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { isIOS, isMobile, isSafari } from 'react-device-detect';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function AppStoreDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isMobile && isIOS && isSafari) {
      setOpen(true);
    }
  }, []);

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={() => ({
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            borderRadius: 5,
            p: 0,
          },
        },
      })}
    >
      <DialogTitle id="alert-dialog-title">
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
      <DialogContent className={'flex flex-row gap-2'}>
        <div className={'flex flex-col gap-2 items-center'}>
          <p className={'text-2xl font-bold text-primary text-center pb-1'}>
            Download our new app!
          </p>
          <a
            target="_blank"
            href={'https://apps.apple.com/us/app/lockspread/id6463576243'}
            rel="noreferrer"
          >
            <Image
              src="/assets/images/icon_appstore.svg"
              alt="LockSpread"
              width={164}
              height={52}
            />
          </a>
          <a
            target="_blank"
            href={'https://apps.apple.com/us/app/lockspread/id6463576243'}
            rel="noreferrer"
          >
            <Image
              src="/assets/images/scan_me.svg"
              alt="LockSpread"
              width={259}
              height={259}
            />
          </a>
        </div>
        <a
          target="_blank"
          href={'https://apps.apple.com/us/app/lockspread/id6463576243'}
          rel="noreferrer"
        >
          <Image
            src="/assets/images/ios-preview.png"
            alt="LockSpread"
            width={300}
            height={500}
            className={'border-r-8'}
          />
        </a>
      </DialogContent>
    </Dialog>
  );
}
