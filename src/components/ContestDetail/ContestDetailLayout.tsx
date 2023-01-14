import React from 'react';

interface ContestDetailLayoutProps {
  handleSubmit?: () => void;
  children: any;
}

const ContestDetailLayout = (props: ContestDetailLayoutProps) => {
  return (
    <div className={'flex flex-col divide-y gap-5 '}>
      <div>{props.children}</div>
    </div>
  );
};

export default ContestDetailLayout;
