import React from 'react';
import style from './value-box.module.scss';
const ValueBox = ({ className, heading, value }) => {
  return (
    <div className={`${style.wrapper} ${className && className}`}>
      <span className={style.heading}>{heading}</span>
      <span className={style.value}>{value ? value : '-'}</span>
    </div>
  );
};

export default ValueBox;
