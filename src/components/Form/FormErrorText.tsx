import React from 'react';

export function FormErrorText(props: { children: any }) {
  return <span className="text-xs text-red-500 ml-3">{props.children}</span>;
}
