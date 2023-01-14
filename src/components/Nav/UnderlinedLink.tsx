import React from 'react';

export const UnderlinedLink: React.FC<{ children: any }> = ({ children }) => (
  <span className="underline text-sm text-gray-200 text-center">
    {children}
  </span>
);
