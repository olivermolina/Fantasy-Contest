import React, { ReactElement } from 'react';
import ContestDetailLayout from '~/components/ContestDetail/ContestDetailLayout';

export interface RulesProps {
  content: ReactElement | string;
}

const Rules = (props: RulesProps) => {
  return <ContestDetailLayout>{props.content}</ContestDetailLayout>;
};

export default Rules;
