import ReactDatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';

import doubleArrowRight from 'assets/1.svg';
import singleArrowRight from 'assets/2.svg';
import singleArrowLeft from 'assets/3.svg';
import doubleArrowLeft from 'assets/4.svg';
import date from 'assets/date-pick.svg';
import style from './date.module.scss';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';
import DateIcon from 'components/icon-component/date-icon';
import DatePickerIcon from 'components/icon-component/date-picker';

const DatePicker = ({
  readOnly,
  name,
  control,
  label,
  className,
  id,
  popperPlacement,
  errorMessage,
  defaultVal,
  handleChange,
  isDisable,
  handleClick,
  showTimeInput,
  maxDate,
  minDate,
  placeholder,
  star,
  backClass,
  rules,
}) => {
  const handleChangeDate = (event, onChange, name) => {
    handleChange?.(event, name);
    onChange(event);
  };

  return (
    <>
      <div className={`${style.main} ${className}`}>
        {label && (
          <label className={style.label}>
            {label}
            <b>{star}</b>
          </label>
        )}
        <div onClick={handleClick} style={{ position: 'relative' }}>
          <Controller
            name={name}
            control={control}
            defaultValue={defaultVal || null}
            rules={rules}
            render={({ field: { onChange, value, name } }) => {
              return (
                <ReactDatePicker
                  popperClassName={backClass}
                  previousMonthAriaLabel={style.classRed}
                  selected={value == 'Invalid Date' ? null : value || null}
                  maxDate={maxDate && maxDate}
                  minDate={minDate && minDate}
                  popperPlacement={popperPlacement}
                  readOnly={readOnly}
                  dateFormat={
                    showTimeInput ? 'MM/dd/yyyy h:mm aa' : 'MM/dd/yyyy'
                  }
                  timeFormat="HH:mm"
                  timeCaption="Time"
                  onChange={(event) => {
                    handleChangeDate(event, onChange, name);
                  }}
                  className={errorMessage ? style.borderClass : style.inpDiv}
                  placeholderText={placeholder ? placeholder : '22/03/2022'}
                  id={id}
                  disabled={isDisable}
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                    prevYearButtonDisabled,
                    nextYearButtonDisabled,
                    increaseYear,
                    decreaseYear,
                  }) => (
                    <div className={style.iconsDiv}>
                      <div>
                        <button
                          style={{ marginLeft: '0px' }}
                          type="button"
                          onClick={decreaseYear}
                          disabled={prevYearButtonDisabled}
                        >
                          <img src={doubleArrowLeft} alt="" />
                        </button>
                        <button
                          type={'button'}
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                        >
                          <img src={singleArrowLeft} alt="" />
                        </button>
                      </div>
                      <p>
                        {months[new Date(date)?.getMonth()]}{' '}
                        {new Date(date)?.getFullYear()}
                      </p>
                      <div>
                        <button
                          type={'button'}
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                        >
                          <img src={singleArrowRight} alt="" />
                        </button>
                        <button
                          type={'button'}
                          onClick={increaseYear}
                          disabled={nextYearButtonDisabled}
                          style={{ marginRight: '0px' }}
                        >
                          <img src={doubleArrowRight} alt="" />
                        </button>
                      </div>
                    </div>
                  )}
                />
              );
            }}
          />
          <label htmlFor={id} className={style.labelDate}>
            <div className={style.icon}>
              <DatePickerIcon />
            </div>
          </label>
        </div>
        {errorMessage ? (
          <span className={style.errorMessage}>{errorMessage}</span>
        ) : (
          ''
        )}
      </div>
    </>
  );
};

export default DatePicker;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
