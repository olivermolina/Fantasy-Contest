import React, { useState } from 'react';
import StarRateIcon from '@mui/icons-material/StarRate';
import { HowToPlayDialog } from './HowToPlay';
import classNames from 'classnames';
import Skeleton from '@mui/material/Skeleton';

const styles = {
  container:
    'flex flex-col lg:flex-row lg:justify-between text-white py-4 px-4 bg-primary min-h-[100px] gap-4',
  button: 'text-white normal-case font-semibold',
  divider: 'h-1 w-1 rounded-full bg-white',
  promoContainer:
    'flex flex-grow justify-center items-center bg-secondary rounded-lg p-4 gap-2',
  linksContainer: 'flex flex-row gap-5 justify-around items-center',
};

interface Props {
  /** The message to display in the promo container */
  challengePromoMessage: string;
  /** Whether the component is loading */
  isLoading: boolean;
  /** The function to call when the contact us button is clicked */
  handleOpenContactUs: () => void;
}

export default function ChallengeHeader(props: Props) {
  const [openHowToPlay, setOpenHowToPlay] = useState(false);
  const handleCloseHowToPlay = () => {
    setOpenHowToPlay(false);
  };

  const handleOpenHowToPlay = () => {
    setOpenHowToPlay(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.promoContainer}>
        <StarRateIcon fontSize="small" />
        {props.isLoading ? (
          <Skeleton
            variant={'text'}
            width={'50%'}
            sx={{ bgcolor: '#144e97' }}
          />
        ) : (
          props.challengePromoMessage
        )}
      </div>
      <div className={styles.linksContainer}>
        <button className={styles.button} onClick={props.handleOpenContactUs}>
          Contact Us
        </button>
        <span className={styles.divider} />
        <button className={styles.button} onClick={handleOpenHowToPlay}>
          How To Play
        </button>
        <span className={classNames(styles.divider, 'hidden')} />
        <button className={classNames(styles.button, 'hidden')}>
          Scoring Chart
        </button>
      </div>
      <HowToPlayDialog
        open={openHowToPlay}
        handleClose={handleCloseHowToPlay}
      />
    </div>
  );
}
