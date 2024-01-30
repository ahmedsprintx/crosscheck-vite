// NOTE: eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from 'react';
import chroma from 'chroma-js';
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import _, { indexOf } from 'lodash';

import Tags from 'components/tags';

import style from './box.module.scss';
import './style.scss';

const formatOptionLabel = (
  { label, isMulti, value, color, index, checkbox, image, imagAlt, optionAttr, options, box },
  { context, selectValue },
  badge,
) => {
  return (
    <div id={'project-status-open'} data-cy={`${optionAttr}${index}`} className={style.formatOptionLabelDiv}>
      {checkbox && isMulti && context !== 'value' && (
        <input
          type="checkbox"
          checked={
            value === '__select_all__'
              ? options.length === selectValue.length
              : selectValue?.find((e) => e.value == value) ?? false
          }
          onChange={(e) => {
            e.preventDefault();
          }}
          className={style.formatOptionLabelInput}
        />
      )}
      {context !== 'value' && box && (
        <div
          style={{
            background: color,
            width: '13px',
            height: '13px',
            borderRadius: '2px',
            margin: '0px 5px',
          }}
        />
      )}
      {badge && context === 'value' ? (
        <Tags color={color} text={label}></Tags>
      ) : (
        <div
          style={{
            fontWeight: 600,
            display: 'flex',
            gap: '20px',
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            ...(context === 'value' && {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }),
          }}
        >
          {image && (
            <img
              src={image}
              alt=""
              height={32}
              width={32}
              style={{
                marginRight: '-10px',
                borderRadius: ' 50%',
              }}
            />
          )}

          {!image && imagAlt && (
            <span
              style={{
                height: '32px',
                width: '32px',
                marginRight: '-10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#11103d',
                color: '#fff',
                borderRadius: '50%',
                fontRize: '9px',
                fontWeight: '400',
                border: '1px solid #fff',
              }}
            >
              {imagAlt}
            </span>
          )}

          <span> {label}</span>
        </div>
      )}
    </div>
  );
};

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

const SelectBox = ({
  label,
  name,
  badge,
  isMulti,
  control,
  noLabel = false,
  disabled,
  id,
  showNumber,
  errorMessage,
  isSearchable = true,
  optionAttr,
  dynamicClass,
  options = [],
  watch = () => {},
  hideIndicator,
  numberBadgeColor,
  showValueOnlyOnDisabled,
  placeholder = 'None Selected',
  backStyle,
  defaultValue,
  rules,
  dynamicWrapper,
  isEditMode = false,
  menuPlacement,
  isClearable = true,
  backInputClass,
  backValue,
  required,
  dropdownId,
}) => {
  const [tooltip, setTooltip] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setIsMenuOpen);

  const selectAllOptions = {
    label: 'Select All',
    value: '__select_all__',
    checkbox: true,
  };

  const ModifiedOptions = options?.length !== 0 ? (isMulti ? [selectAllOptions, ...options] : [...options]) : [];

  return (
    <>
      <div className={`${style.wraper} ${dynamicWrapper && dynamicWrapper}`} ref={wrapperRef}>
        {!noLabel && (
          <label className={style.lbl}>
            {label}
            {required && <p></p>}
          </label>
        )}
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
              render={({ field, value }) => {
                const tooltipText = _.isArray(field?.value)
                  ? field?.value.join(', ')
                  : _.isObject(field?.value)
                  ? field?.value?.barStatus
                  : field?.value;

                return showValueOnlyOnDisabled && disabled ? (
                  <div className={style.displayValueOnly}>{field.value}</div>
                ) : (
                  <div data-cy={id}>
                    <Select
                      menuIsOpen={isMenuOpen}
                      id={id}
                      menuPlacement={menuPlacement}
                      closeMenuOnSelect={!isMulti || !isMenuOpen}
                      closeMenuOnScroll={true}
                      ref={control.register(name)}
                      isOptionDisabled={(option) => option.isdisabled}
                      onMenuOpen={() => setIsMenuOpen(true)}
                      onMenuClose={() => setIsMenuOpen(false)}
                      isMulti={isMulti}
                      components={{
                        ...(hideIndicator && {
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null,
                        }),
                        ...(showNumber &&
                          isMulti && {
                            MultiValue: (props) => {
                              const { getValue, data } = props;
                              const selectedOptions = getValue();
                              const currentOptionIdx = selectedOptions.findIndex(
                                (option) => option.value === data.value,
                              );
                              if (selectedOptions.length > 1) {
                                return currentOptionIdx === 0 ? (
                                  <p className={style.tagClass}>{selectedOptions?.length} Selected</p>
                                ) : (
                                  <></>
                                );
                              } else {
                                return currentOptionIdx === 0 ? <p className={style.tagClass}>{data.label}</p> : <></>;
                              }
                            },
                          }),

                        SingleValue: (props) => {
                          const { data } = props;

                          return <p className={style.tagClass}>{data.label}</p>;
                        },
                      }}
                      formatOptionLabel={(data, metaData) =>
                        formatOptionLabel({ ...data, isMulti, options, optionAttr }, metaData, badge, showNumber)
                      }
                      hideSelectedOptions={false}
                      options={ModifiedOptions}
                      styles={colourStyles(
                        isMulti,
                        isEditMode,
                        field?.value,
                        backInputClass,
                        backStyle,
                        backValue,
                        errorMessage,
                      )}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          text: 'blue',
                          primary25: 'pink',
                          primary: 'black',
                        },
                      })}
                      className={`${style.selectClass} ${dynamicClass}`}
                      {...field}
                      isDisabled={disabled}
                      value={setDafaultValueInSelectBox(field?.value, ModifiedOptions)}
                      onChange={(selectedOption) => {
                        field.onChange(
                          isMulti
                            ? selectedOption?.some((x) => x.value === '__select_all__')
                              ? options.length !== selectedOption?.length - 1
                                ? options.map((e) => e.value)
                                : []
                              : selectedOption.map((e) => e.value)
                            : selectedOption
                            ? selectedOption.value
                            : null,
                        );
                        setTooltip(false);
                      }}
                      placeholder={placeholder}
                      classNamePrefix="your-selector"
                      isClearable={isClearable}
                      isSearchable={isSearchable}
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

export default SelectBox;

const setDafaultValueInSelectBox = (value, options) => {
  if (_.isString(value)) return options.find((c) => c.value === value);
  if (_.isArray(value)) return options.filter((option) => value.includes(option.value));
  if (_.isObject(value)) return options.find((c) => c.value === value?.barStatus);
  return null;
};
const colourStyles = (isMulti, isEditMode, value, backInputClass, backValue, errorMessage, backStyle) => {
  return {
    control: (styles, { isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backStyle,
      background: `var(--background-color1) !important`,
      boxShadow: 'none',
      border: isSelected
        ? '1px solid var(--text-color3,#D6D6D6) !important'
        : isFocused && !errorMessage
        ? '1px solid var(--text-color3,#D6D6D6) !important'
        : '1px solid #D6D6D6 !important',
      borderRadius: '5px',
      display: 'flex !important',
      alignItems: 'center !important',
      padding: '0px 10px ',
      minHeight: '35px',
      cursor: 'pointer',

      '&:focus': {
        border: '1px solid var(--text-color3) !important',
      },
      '&:active': {
        border: '1px solid var(--text-color3) !important',
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
        zIndex: !isEditMode ? 3 : 4,
        backgroundColor: 'var(--background-color1,#fff)',
        color: 'var(--text-color1) !important',
      };
    },
  };
};
