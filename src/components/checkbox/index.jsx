/* eslint-disable no-comments/disallowComments */
/* eslint-disable react/no-unknown-property */
import React from 'react';
import style from './checkbox.module.scss';

const Checkbox = ({
  id,
  name,
  label,
  checked,
  register,
  className,
  handleChange,
  errorMessage,
  readOnly,
  containerClass,
  onLabelClick,
  partial,
  disabledCheck,
  checkMarkAfter,
  dataCy,
  ...restOfProps
}) => {
  return (
    <div>
      <label
        className={`${style.container} ${containerClass || ''}`}
        htmlFor={onLabelClick ? null : id}
        style={{ color: errorMessage ? '#ff5050' : '' }}
      >
        {label && label}
        <input
          name={name}
          type="checkbox"
          id={id}
          onClick={onLabelClick}
          readOnly={readOnly && readOnly}
          onChange={handleChange && handleChange}
          {...(register && register(name))}
          checked={checked && checked}
          indeterminate={partial && partial}
          {...restOfProps}
          disabled={disabledCheck}
          height={10}
        />
        <span
          className={`${style.checkMark} ${className}`}
          data-cy={dataCy}
          style={{ borderColor: errorMessage ? '#ff5050' : '' }}
        ></span>
        {partial && <span className={`${style.checkMark1} ${checkMarkAfter}`}></span>}
      </label>
    </div>
  );
};

export default Checkbox;
