import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { InferPropTypes } from '..';

export const PillButtonPropTypes = {
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  name: PropTypes.string.isRequired,
};

type Props = InferPropTypes<typeof PillButtonPropTypes>;

export function PillButton(props: Props) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={classNames('px-4 py-1 rounded-full flex-none', {
        'bg-white shadow': props.selected,
        'bg-slate-200': !props.selected,
        'cursor-not-allowed': props.disabled,
      })}
    >
      {props.children}
    </button>
  );
}
