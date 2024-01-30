import React from "react";

import style from "./textarea.module.scss";

const TextArea = ({
  label,
  name,
  register,
  placeholder,
  errorMessage,
  onChange,
  isDisable,
  value,
  onClick,
  defaultValue,
  row,
  dataCy
}) => {
  return (
    <>
      <div className={style.note} onClick={onClick}>
        {label && <label>{label}</label>}
        <textarea
          data-cy={dataCy}
          style={{
            border: errorMessage ? "1px solid #ff5050" : "",
          }}
          placeholder={placeholder}
          name={name}
          rows={row ? row : 3}
          defaultValue={defaultValue}
          onChange={onChange}
          value={value}
          {...(register && register(name))}
          disabled={isDisable || false}
        ></textarea>
        {errorMessage && (
          <span className={style.errorMessage}>{errorMessage}</span>
        )}
      </div>
    </>
  );
};

export default TextArea;
