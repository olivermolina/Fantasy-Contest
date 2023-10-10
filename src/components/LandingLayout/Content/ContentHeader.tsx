import React from 'react';
import { Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { FadeInUpBox } from '~/components/FramerMotion/FadeInUpBox';

interface Props {
  isLoading: boolean;
  heading1: string;
  heading2: string;
}

const ContentHeader = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-between gap-y-2 md:gap-y-5">
      {props.isLoading ? (
        <Skeleton variant="rectangular" className={'w-full'} />
      ) : (
        <FadeInUpBox duration={1}>
          <p className="text-white text-[60px] md:text-[90.44px] font-bold text-center leading-[77px] tracking-normal md:my-10">
            {props.heading1}
          </p>
        </FadeInUpBox>
      )}

      <div className="flex items-center justify-center gap-x-1 md:gap-x-5  w-full md:w-5/6 lg:w-4/5 max:w-2/5">
        <div className={'min-w-fit'}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
              scale: {
                type: 'spring',
                damping: 5,
                stiffness: 100,
                restDelta: 0.001,
              },
            }}
          >
            <img
              className="object-cover w-[60px] h-auto md:w-auto"
              src={'/assets/images/trophy.svg'}
              alt="Trophy"
            />
          </motion.div>
        </div>
        {props.isLoading ? (
          <Skeleton variant="rectangular" className={'w-full'} />
        ) : (
          <FadeInUpBox duration={1}>
            <p className="text-white text-[24px] md:text-[40px] font-bold text-center tracking-normal">
              {props.heading2}
            </p>
          </FadeInUpBox>
        )}
        <div className={'min-w-fit'}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
              scale: {
                type: 'spring',
                damping: 5,
                stiffness: 100,
                restDelta: 0.001,
              },
            }}
          >
            <img
              className="object-cover w-[60px] h-auto md:w-auto"
              src={'/assets/images/football.svg'}
              alt="Football"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
