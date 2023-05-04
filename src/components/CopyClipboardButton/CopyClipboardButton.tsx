import React, { useState } from 'react';
import { Tooltip } from '@mui/material';
import Icons from '~/components/Icons/Icons';

interface CopyButtonProps {
  text: string;
}

const CopyClipboardButton = (props: CopyButtonProps) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(props.text);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Tooltip title="Copied to clipboard!" open={open} onClose={handleClose}>
      <button onClick={handleClick}>
        <Icons.ClipboardDocument className={'h-6 w-6'} />
      </button>
    </Tooltip>
  );
};

export default CopyClipboardButton;
