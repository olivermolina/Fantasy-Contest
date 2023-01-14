import React from 'react';
import ContentLoader from 'react-content-loader';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import classNames from 'classnames';

interface AvatarProps {
  imgSrc: string;
  height?: string | number;
  width?: string | number;
  variant: string;
}

export function Avatar(props: AvatarProps) {
  return (
    <>
      <LazyLoadImage
        placeholder={
          <ContentLoader
            width={props.width}
            height={props.height}
            speed={1}
            foregroundColor={'#2b66e6'}
          >
            <rect
              x="0"
              y="0"
              rx={props.width}
              ry={props.height}
              width={props.width}
              height={props.height}
            />
          </ContentLoader>
        }
        className={classNames('object-cover', {
          [`${
            props?.variant == 'rectangle'
              ? 'rounded h-40 lg:w-56 lg:h-32'
              : 'rounded-full'
          }`]: props.variant,
        })}
        alt={'Avatar image display'}
        src={props.imgSrc} // use normal <img> attributes as props
      />
    </>
  );
}
