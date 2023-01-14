import React from 'react';

export const CardTag = (props: React.PropsWithChildren) => (
  <div className="bg-gray-200 text-xs p-1 rounded flex-none">
    {props.children}
  </div>
);
