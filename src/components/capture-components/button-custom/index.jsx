import React from 'react';

import style from './button.module.scss';

const Button = ({
  text,
  iconStart,
  iconEnd,
  handleClick,
  type,
  className,
  isLoading,
  btnClass,
  disabled,
  btnLoaderClass,
  form,
  width,
  showProgress,
  progress,
  loader = false,
  startCompo,
  ...restOfProps
}) => {
  return (
    <>
      <button
        className={`${style.btn} ${btnClass}`}
        type={type}
        form={form}
        onClick={handleClick}
        disabled={disabled}
        style={{
          pointerEvents: disabled ? 'none' : 'auto',
          width,
          position: 'relative',
        }}
        {...restOfProps}
      >
        {iconStart ? iconStart : startCompo ? startCompo : ''}
        {text && <span className={`${style.btnTitle} ${className}`}>{text}</span>}
      </button>
    </>
  );
};

export default Button;
