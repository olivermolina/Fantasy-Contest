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
  /**
   * Referral Description
   */
  referralCustomText: string;
}

const styles = {
  item: 'flex flex-col rounded-lg gap-2',
  field:
    'flex justify-start items-center bg-[#2F5F98] rounded-lg divide-x divide-slate-500 border-slate-500 border',
  text: 'p-2 bg-[#1A487F] w-full rounded-r-lg',
  copyButton: 'bg-[#2F5F98] rounded-l-lg px-1',
};

const Referral = ({ referralCode, referralCustomText }: ReferralProps) => {
  const referralLink = `${window.location.origin}/auth/sign-up?referral=${referralCode}`;
  return (
    <div className={`w-full lg:p-4`}>
      <div className="flex flex-col p-2 lg:p-6 gap-2 rounded-lg shadow-md gap-4">
        <p className="font-bold text-xl">Referral</p>
        <p className="font-semibold text-md">{referralCustomText}</p>
        <div
          className={`flex flex-col lg:flex-row justify-start gap-4 lg:gap-10`}
        >
          <div className={styles.item}>
            <p>Referral Code</p>
            <div className={styles.field}>
              <div className={styles.copyButton}>
                <CopyButton
                  handleCopy={() => navigator.clipboard.writeText(referralCode)}
                />
              </div>
              <p className={styles.text}>{referralCode}</p>
            </div>
          </div>
          <div className={styles.item}>
            <p>Referral Link</p>
            <div className={styles.field}>
              <div className={styles.copyButton}>
                <CopyButton
                  handleCopy={() => navigator.clipboard.writeText(referralLink)}
                />
              </div>
              <p className={styles.text}>{referralLink}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
