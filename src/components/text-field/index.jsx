import React, { useRef } from 'react';

import style from './input.module.scss';

const TextField = ({
  searchField,
  id,
  ref,
  type,
  icon,
  name,
  label,
  value,
  onClick,
  clearIcon,
  onClear,
  register,
  readOnly,
  onChange,
  className,
  isDisable,
  iconClass,
  wraperClass,
  placeholder,
  errorMessage,
  onClickHandle,
  searchClearToggle,
  defaultValue,
  backCompo,
  onEnter,
  required,
  ...restOfProps
}) => {
  const textRef = useRef();
  return (
    <>
      <div className={`${style.inputContainer} ${wraperClass} `}>
        {label && (
          <label>
            {label}

            {required && <div></div>}
          </label>
        )}
        <div style={{ position: 'relative' }} className={className} onClick={onClickHandle}>
          <input
            id={searchField ? 'searchField' : id}
            ref={ref ? ref : textRef}
            style={{
              border: errorMessage ? '1px solid #ff5050' : '',
              backgroundColor: readOnly || isDisable ? 'transparent' : '',
            }}
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            {...(register && { ...register(name) })}
            onKeyDown={onEnter && onEnter}
            defaultValue={defaultValue}
            readOnly={readOnly || false}
            disabled={isDisable || false}
            {...restOfProps}
            autoComplete="off"
            step={'any' || restOfProps.step}
          />

          {clearIcon && textRef?.current?.value && (
            <img
              className={`${style.crossIcon} ${iconClass}`}
              style={{ cursor: 'pointer' }}
              src={clearIcon}
              alt=""
              onClick={() => {
                onClear();
                if (textRef.current) textRef.current.value = '';
              }}
            />
          )}

          {icon && (
            <img
              className={`${style.icon} ${iconClass}`}
              style={{ cursor: 'pointer' }}
              src={icon}
              alt=""
              onClick={onClick}
              data-cy="login-form-password-eye-icon"
            />
          )}
          {backCompo && (
            <div
              className={`${style.icon} ${iconClass}`}
              style={{ cursor: 'pointer' }}
              onClick={onClick}
            >
              {backCompo}
            </div>
          )}
        </div>
        {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
      </div>
    </>
  );
};

export default TextField;
