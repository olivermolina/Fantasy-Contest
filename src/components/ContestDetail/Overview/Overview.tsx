import React, { ReactElement } from 'react';
import ContestDetailLayout from '~/components/ContestDetail/ContestDetailLayout';

export interface OverviewProps {
  content: ReactElement | string;
}

const Overview = (props: OverviewProps) => {
  return <ContestDetailLayout>{props.content}</ContestDetailLayout>;
};

export default Overview;
