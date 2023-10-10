import React, { useEffect } from 'react';
import { ReactComponent } from '~/components/Icons/Icons';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export interface ExplainerCardProps {
  /**
   * Image URL
   * @example https://mysite.com/image.png
   */
  image: ReactComponent | string;
  /**
   * Explainer Title
   * @example Win Cash Prizes!
   */
  title: string;
  /**
   * Explainer description
   * @example Pay more or less...
   */
  description: string;
}

const ExplainerCard = (props: ExplainerCardProps) => {
  const control = useAnimation();
  const [ref, inView] = useInView();
  const Image = props.image;
  useEffect(() => {
    if (inView) {
      control.start('visible');
    }
  }, [control, inView]);
  return (
    <motion.div
      ref={ref}
      variants={{
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        hidden: { opacity: 0, scale: 0 },
      }}
      initial={'hidden'}
      animate={control}
      className="flex flex-col justify-start items-center gap-2 border-white rounded-lg border-2 p-5 md:p-10 w-full bg-[#1A395B] bg-opacity-40"
    >
      {/* Explainer Image */}

      {typeof props.image === 'string' ? (
        <img
          src={props.image}
          className="rounded-lg max-w-full h-40 w-80"
          alt=""
        />
      ) : (
        <Image className="rounded-lg max-w-full h-40 w-80" />
      )}

      {/* Explainer Title */}
      <p className="text-white text-[36px] leading-[46px] font-bold text-center tracking-normal opacity-92 p4">
        {props.title}
      </p>

      {/* Explainer Description */}
      <p className="text-white text-[16px] leading-[19px] font-bold text-center tracking-normal p4">
        {props.description}
      </p>
    </motion.div>
  );
};

export default ExplainerCard;
