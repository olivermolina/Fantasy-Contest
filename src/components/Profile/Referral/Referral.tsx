import React, { useState } from 'react';
import Icons from '~/components/Icons/Icons';
import { Tooltip } from '@mui/material';

interface CopyButtonProps {
  handleCopy: () => void;
}

const CopyButton = (props: CopyButtonProps) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    props.handleCopy?.();
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

export interface ReferralProps {
  /**
   * Referral Code
   */
  referralCode: string;
}

const Referral = ({ referralCode }: ReferralProps) => {
  const referralLink = `${window.location.origin}/auth/sign-up?referral=${referralCode}`;
  return (
    <div className={`w-full lg:p-4`}>
      <div className="flex flex-col p-6 gap-2 rounded-lg shadow-md p-4 gap-4">
        <p className="font-bold text-xl">Referral</p>
        <p className="font-semibold text-md">
          Refer a friend from the link or code in your profile and get $25 in
          bonus credit!
        </p>
        <div className={`flex flex-col justify-between gap-4`}>
          <div className={`flex justify-between p-2 bg-gray-100 rounded-lg`}>
            <p>Referral Code</p>
            <div className={'flex items-center gap-2'}>
              <p>{referralCode}</p>
              <CopyButton
                handleCopy={() => navigator.clipboard.writeText(referralCode)}
              />
            </div>
          </div>
          <div className={`flex justify-between p-2 bg-gray-100 rounded-lg`}>
            <p>Referral Link</p>
            <div className={'flex gap-2 justify-items-end'}>
              <p className={'text-right'}>{referralLink}</p>
              <CopyButton
                handleCopy={() => navigator.clipboard.writeText(referralLink)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
