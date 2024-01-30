// NOTE: eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from 'react';
import chroma from 'chroma-js';
import CreatableSelect from 'react-select/creatable';
import { Controller } from 'react-hook-form';
import _ from 'lodash';

import style from './box.module.scss';
import './style.scss';

const useOutsideAlerter = (ref, setIsMenuOpen) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        // NOTE: setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};

const CreatableSelectComponent = ({
  defaultOptions = [],
  dynamicWrapper,
  label,
  errorMessage,
  control,
  dynamicClass,
  defaultValue,
  rules,
  isClearable,
  disabled,
  showValueOnlyOnDisabled,
  name,
  isEditMode,
  placeholder,
  backInputClass,
  backValue,
}) => {
  const [tooltip, setTooltip] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setIsMenuOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const [value, setValue] = useState();

  const handleCreate = (inputValue, setValue) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      setValue(newOption);
    }, 1000);
  };
  return (
    <>
      <div className={`${style.wraper} ${dynamicWrapper && dynamicWrapper}`} ref={wrapperRef}>
        <label className={style.lbl} style={{ marginBottom: '20px' }}>
          {label}
        </label>
        <div
          className={style.selectBox}
          style={{
            borderRadius: '6px',
            border: errorMessage ? '1px solid red' : '',
          }}
        >
          {control && (
            <Controller
              name={name}
              control={control}
              rules={rules}
              defaultValue={defaultValue}
              render={({ field }) => {
                const tooltipText = _.isArray(field?.value)
                  ? field?.value.join(', ')
                  : _.isObject(field?.value)
                  ? field?.value?.barStatus
                  : field?.value;

                return showValueOnlyOnDisabled && disabled ? (
                  <div className={style.displayValueOnly}>{field.value}</div>
                ) : (
                  <div>
                    <CreatableSelect
                      isClearable={isClearable}
                      placeholder={placeholder}
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      onChange={(newValue) => field.onChange(newValue)}
                      onCreateOption={(value) => handleCreate(value, field.onChange)}
                      options={options}
                      value={field.value}
                      styles={colourStyles(isEditMode, field?.value, errorMessage, backInputClass, backValue)}
                      className={`${style.selectClass} ${dynamicClass}`}
                    />
                    {!isMenuOpen && tooltip && tooltipText ? (
                      <div className={style.tooltip}>
                        <div className={style.tooltipChild}>
                          <p className={style.tooltipText}>{tooltipText}</p>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                );
              }}
            ></Controller>
          )}
        </div>
        {errorMessage ? <span className={style.errorMessage}>{errorMessage}</span> : ''}
      </div>
      {isMenuOpen && <div className={style.backdropDiv} onClick={() => setIsMenuOpen(false)}></div>}
    </>
  );
};

export default CreatableSelectComponent;

const createOption = (label) => ({
  label,
  value: label.replace(/\W/g, ''),
});

const colourStyles = (isMulti, isEditMode, value, backInputClass, backValue, errorMessage) => {
  return {
    control: (styles, { isDisabled, isFocused, isSelected }) => ({
      ...styles,
      background: `var(--background-color1) !important`,
      boxShadow: 'none',
      border: isSelected
        ? '1px solid var(--text-color3) !important'
        : isFocused && !errorMessage
        ? '1px solid var(--text-color3) !important'
        : '1px solid #D6D6D6 !important',
      borderRadius: '5px',
      display: 'flex !important',
      alignItems: 'center !important',
      padding: '0px 10px ',
      minHeight: '35px',
      cursor: 'pointer',
      '&:hover': {
        outline: isFocused ? 0 : 0,
      },
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
      const color = chroma('#333333');
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : !isMulti && isSelected
          ? '#11103D2A'
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled ? '#ccc' : 'var(--text-color1)',

        cursor: isDisabled ? 'not-allowed' : '#fff',
        ':hover': {
          ...styles[':hover'],
          backgroundColor: 'var(--hover)',
        },
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled ? (isSelected ? '#fff' : color.alpha(0.3).css()) : '#fff',
          zIndex: '5000 !important',
        },
      };
    },

    placeholder: (styles) => ({
      ...styles,
      fontSize: '13px',
      color: 'var(--placeholder)',
      fontWeight: 400,
    }),

    multiValue: (styles, { data }) => {
      const color = chroma(data?.color || 'black');
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    Input: (styles) => {
      return {
        ...styles,
        color: 'var(--placeholder)',
        ...backInputClass,
      };
    },

    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: 'var(--placeholder)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',

      textOverflow: 'ellipsis',
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: 'var(--placeholder)',
      ':hover': {
        backgroundColor: data?.color || 'black',
        color: 'white',
      },
    }),
    dropdownIndicator: (_, context) => {
      return {
        transform: `rotate(${context.selectProps.menuIsOpen ? '180deg' : '0deg'})`,
        transition: 'transform 0.2s',
        color: 'var(--grey-icon)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      };
    },
    indicatorSeparator: (styles) => {
      return {
        ...styles,
        width: '0px !important',
      };
    },
    clearIndicator: () => {
      return {
        padding: 0,
        marginTop: '5px',
        fill: 'var(--grey-icon)',
      };
    },

    valueContainer: (styles) => {
      return {
        ...styles,
        paddingLeft: 0,
        paddingRight: 0,
        display: 'flex',
        color: 'var(--text-color3)',
        ...backValue,
      };
    },

    menu: (styles) => {
      return {
        ...styles,
        zIndex: !isEditMode ? 3 : 1,
        backgroundColor: 'var(--background-color1) !important',
        color: 'var(--text-color1) !important',
      };
    },
  };
};
