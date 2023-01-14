import React from 'react';
import { ReactComponent } from '~/components/Icons/Icons';

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
  const Image = props.image;
  return (
    <div className="flex flex-col justify-start items-center gap-2 border-white rounded-[27px] border-2 sm:min-w-auto md:w-[280px] lg:w-[400px] h-auto p-5 md:p-10">
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
    </div>
  );
};

export default ExplainerCard;
