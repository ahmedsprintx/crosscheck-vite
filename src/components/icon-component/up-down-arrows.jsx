import React from 'react';
import style from './icons.module.scss';

const UpDownArrow = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M18.1739 8.08696L12.087 2L6 8.08696M18.1739 15.913L12.087 22L6 15.913"
        stroke="#2A2C33"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={style.fill2}
      />
    </svg>
  );
};

export default UpDownArrow;
