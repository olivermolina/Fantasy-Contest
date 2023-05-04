import React from 'react';

export const CardTag = (props: React.PropsWithChildren) => (
  <div className="bg-white bg-opacity-10 text-slate-100 text-xs p-0.5 lg:p-1 rounded text-center">
    {props.children}
  </div>
);
