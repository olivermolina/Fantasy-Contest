import React from 'react';

const PendingCircle = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-6 h-6 stroke-gray-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m 21,12 c 0,4.970566 -4.029437,8.999996 -9,8.999996 -4.9705626,0 -9,-4.02943 -9,-8.999996 0,-4.9705661 4.0294374,-8.9999961 9,-8.9999961 4.970563,0 9,4.02943 9,8.9999961 z"
        {...props}
      />
    </svg>
  );
};

export default PendingCircle;
