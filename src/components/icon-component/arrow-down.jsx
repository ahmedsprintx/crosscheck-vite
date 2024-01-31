import React from 'react';

import style from './icons.module.scss';

const ArrowDown = () => {
  return (
    <>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="10" fill="#11103D" className={style.fill4} />
        <path
          d="M8.94531 13.2373L12.1968 9.98458L8.94531 6.73186"
          stroke="white"
          strokeWidth="1.07366"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.fill}
        />
      </svg>
    </>
  );
};

export default ArrowDown;
