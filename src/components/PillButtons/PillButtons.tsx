import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '..';
import { PillButton, PillButtonPropTypes } from './PillButton';

export const PillButtonsPropTypes = {
  pills: PropTypes.arrayOf(PropTypes.shape(PillButtonPropTypes).isRequired),
};

export type PillButtonsProps = InferPropTypes<typeof PillButtonsPropTypes>;

export const PillButtons = (props: PillButtonsProps) => {
  return (
    <div className="flex gap-2 lg:py-2 lg:gap-4 w-full overflow-x-auto px-1">
      {props.pills?.map((pill, i) => (
        <PillButton key={i} {...pill}></PillButton>
      ))}
    </div>
  );
};

PillButtons.propTypes = PillButtonsPropTypes;
