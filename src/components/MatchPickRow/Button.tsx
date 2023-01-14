import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '..';
import classNames from 'classnames';

export const ButtonPropTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func,
};

type Props = InferPropTypes<typeof ButtonPropTypes>;

export const Button = (props: Props) => {
  const onClickButton = () => {
    props.onClick && props.onClick();
  };
  return (
    <button
      onClick={onClickButton}
      className={classNames(
        'flex flex-col items-center w-14 text-xs h-14 justify-center font-bold text-center text-sky-600 align-middle bg-sky-100 rounded shadow whitespace-nowrap',
        {
          'hover:bg-blue-500 hover:text-white': !props.disabled,
          'cursor-not-allowed': props.disabled,
        },
      )}
      disabled={!!props.disabled}
    >
      {props.children}
    </button>
  );
};

Button.propTypes = ButtonPropTypes;
