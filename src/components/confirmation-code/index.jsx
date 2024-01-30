import React, { useRef, useEffect } from 'react';

import { useController } from 'react-hook-form';

import style from './code.module.scss';

const Code = ({ label, name, control }) => {
  const inputsRef = useRef([]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const { field } = useController({
    name,

    control,

    defaultValue: '',
  });

  const handleInputChange = ({ index, event }) => {
    const value = event.target.value;

    const newInputValue = field.value.slice(0, index) + value + field.value.slice(index + 1);

    field.onChange(newInputValue);

    if (value.length === 1 && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleInputKeyDown = ({ index, event }) => {
    if (event.key === 'Backspace' && index > 0 && !event.currentTarget.value) {
      const newInputValue = field.value.slice(0, index - 1) + field.value.slice(index);

      field.onChange(newInputValue);

      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className={style.inputContainer}>
      {label && <label>{label}</label>}

      <div className={style.inputs}>
        {[...Array(4)].map((_, index) => {
          const inputName = `${name}.${index}`;

          return (
            <input
              key={index}
              type="number"
              maxLength={1}
              value={field.value?.[index] || ''}
              name={inputName}
              ref={(input) => (inputsRef.current[index] = input)}
              onKeyDown={(event) => handleInputKeyDown({ index, event })}
              onChange={(event) => handleInputChange({ index, event, inputName })}
            />
          );
        })}
      </div>

      <p className={style.p}>Confirm your account with code from your email.</p>
    </div>
  );
};

export default Code;
