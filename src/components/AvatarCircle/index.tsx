import React from 'react';
import ContentLoader from 'react-content-loader';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface AvatarCircleProps {
  imgSrc: string;
  height: string | number | undefined;
  width: string | number | undefined;
}

export function AvatarCircle(props: AvatarCircleProps) {
  return (
    <>
      <LazyLoadImage
        style={{
          height: props.height,
          width: props.width,
        }}
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
        className="object-cover rounded-full"
        alt={'Avatar image display'}
        src={props.imgSrc} // use normal <img> attributes as props
      />
    </>
  );
}
