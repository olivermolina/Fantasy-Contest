import React from 'react';
import classnames from 'classnames';

export function CartTopItemButton(props: {
  isActive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) {
  return (
    <button
      className={classnames('text-center p-4 flex-grow', {
        'text-gray-300': !props.isActive,
        'border-b-4 border-blue-600': props.isActive,
      })}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
