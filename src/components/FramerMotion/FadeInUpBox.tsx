import React, { useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { IntersectionContext } from './IntersectionObserver';

const DELAY = 0.25;
const OFFSET = 0.4;

export const FadeInUpBox = ({
  children,
  yOffset = 24, // y initial position
  easing = [0.42, 0, 0.58, 1], // [number, number, number, number] | "linear" | "easeIn" |
  //  "easeOut" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" |
  // "backInOut" | "anticipate" | EasingFunction;
  delayOrder, // order of appearance
  ...rest
}: any) => {
  const { inView } = useContext(IntersectionContext);

  const transition = useMemo(
    () => ({
      duration: 0.4,
      delay: delayOrder ? delayOrder * OFFSET : DELAY,
      ease: easing,
    }),
    [easing, delayOrder],
  );

  const variants = {
    hidden: { y: yOffset, opacity: 0, transition },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      exit="hidden"
      variants={variants}
      {...rest}
    >
      {children} {inView}
    </motion.div>
  );
};
