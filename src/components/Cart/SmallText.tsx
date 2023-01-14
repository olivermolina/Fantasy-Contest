import React from 'react';

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
}) {
  return <div className="text-xs text-gray-500">{props.children}</div>;
}
