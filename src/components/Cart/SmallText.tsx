import React from 'react';
import classNames from 'classnames';

export function SmallText(props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
  textColor?: string;
  textAlign?: string;
}) {
  return (
    <div
      className={classNames(
        'text-xs text-gray-500',
        {
          'text-gray-500': !props.textColor,
        },
        props.textColor,
        props.textAlign,
      )}
    >
      {props.children}
    </div>
  );
}
