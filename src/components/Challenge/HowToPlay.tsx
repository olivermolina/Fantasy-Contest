import React from 'react';
import { Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  handleClose: () => void;
  open: boolean;
}

const styles = {
  item: 'flex flex-col gap-2 bg-[#1A487F] p-4 rounded-lg',
};

export function HowToPlayDialog(props: Props) {
  return (
    <Dialog
      open={props.open}
      fullWidth
      maxWidth={'sm'}
      sx={(theme) => ({
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            borderRadius: 5,
            backgroundColor: theme.palette.primary.main,
          },
        },
      })}
    >
      <HowToPlay {...props} />
    </Dialog>
  );
}

export default function HowToPlay(props: Props) {
  return (
    <div className={'flex flex-col gap-4 text-white bg-[#003370] p-4'}>
      <div className={'flex justify-between items-center'}>
        <span className={'text-xl font-semibold'}>How to Play</span>
        <IconButton onClick={props.handleClose}>
          <CloseIcon
            sx={(theme) => ({
              color: 'white',
              fontSize: 30,
              [theme.breakpoints.up('md')]: {
                fontSize: 40,
              },
            })}
          />
        </IconButton>
      </div>
      <div className={styles.item}>
        <div className={'flex gap-2 items-center text-sm'}>
          <span className={'rounded-full p-1 bg-[#003370] text-xs'}>01</span>
          <span>Choose 2 or more players from any sport</span>
        </div>
        <div className={'flex gap-2'}>
          <Image
            src="/assets/images/how-to-play-1.png"
            height={71}
            width={201}
            alt="Logo"
          />
        </div>
      </div>
      <div className={styles.item}>
        <div className={'flex gap-2 items-center text-sm'}>
          <span className={'rounded-full p-1 bg-[#003370] text-xs'}>02</span>
          <span>Pick MORE or LESS on their projected stats</span>
        </div>
        <div className={'flex gap-2'}>
          <Image
            src="/assets/images/how-to-play-2.png"
            height={75}
            width={160}
            alt="Logo"
          />
        </div>
      </div>
      <div className={styles.item}>
        <div className={'flex gap-2 items-center text-sm'}>
          <span className={'rounded-full p-1 bg-[#003370] text-xs'}>02</span>
          <span>Choose INSURED or ALL IN</span>
        </div>
        <div className={'flex gap-2'}>
          <Image
            src="/assets/images/how-to-play-3.png"
            height={71}
            width={265}
            alt="Logo"
          />
        </div>
      </div>
      <div className={'flex flex-row-reverse'}>
        <Link href="/contest-rules" legacyBehavior>
          <a
            className={'underline cursor-pointer'}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Rules
          </a>
        </Link>
      </div>
    </div>
  );
}
