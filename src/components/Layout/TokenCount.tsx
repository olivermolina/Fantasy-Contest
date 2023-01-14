import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

export function TokenCount(props: { count: number }) {
  const [isMounted, setIsMounted] = useState(false); // Need this for the react-tooltip

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <div className="inline-block">
      {isMounted && <ReactTooltip />}
      <div
        className="bg-blue-500 text-white text-smfont-bold p-2 rounded"
        data-tip="Tokens only apply to this contest."
      >
        <div className="flex nowrap items-center">
          <span className="p-1 px-2 mx-1 rounded-full text-xs bg-white text-blue-600">
            T
          </span>{' '}
          {Number(props.count).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
