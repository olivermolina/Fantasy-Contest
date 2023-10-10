import React, { useState } from 'react';
import ChallengeHeader from '~/components/Challenge/ChallengeHeader';
import { useAppSelector } from '~/state/hooks';
import { Dialog } from '@mui/material';
import ContactUsContainer from '~/containers/ContactUsContainer';
import CloseIcon from '@mui/icons-material/Close';

const ChallengeHeaderContainer = () => {
  const [challengePromoMessage, isLoading] = useAppSelector((state) => [
    state.appSettings.CHALLENGE_PROMO_MESSAGE,
    state.appSettings.initial,
  ]);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <ChallengeHeader
        challengePromoMessage={challengePromoMessage}
        isLoading={isLoading}
        handleOpenContactUs={handleOpen}
      />
      <Dialog
        open={open}
        sx={(theme) => ({
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              borderRadius: 5,
              backgroundColor: theme.palette.primary.main,
              position: 'relative',
            },
          },
        })}
      >
        <button onClick={handleClose}>
          <CloseIcon
            sx={{
              color: 'white',
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          />
        </button>
        <div className={'text-white'}>
          <ContactUsContainer />
        </div>
      </Dialog>
    </>
  );
};

export default ChallengeHeaderContainer;
