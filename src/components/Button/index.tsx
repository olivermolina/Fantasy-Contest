import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '..';
import classNames from 'classnames';

export const ButtonPropTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.element.isRequired,
  variant: PropTypes.string,
  onClick: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
        `flex flex-col items-center justify-center font-bold text-center  text-base align-middle  rounded shadow whitespace-nowrap`,
        {
          'w-{props.width}': props.width,
          'w-72 lg:w-36': !props.width,
          'h-{props.height}': props.height,
          'h-10': !props.height,
        },
        {
          'hover:bg-blue-600 hover:text-white': !props.disabled,
          'cursor-not-allowed': props.disabled,
        },
        {
          'text-blue-500 bg-white outline ': props.variant == 'outline',
          'bg-blue-500': !props.variant || props.variant == 'primary',
          'text-white': !props.variant || props.variant == 'primary',
        },
      )}
      disabled={!!props.disabled}
    >
      {props.children}
    </button>
  );
};

Button.propTypes = ButtonPropTypes;
