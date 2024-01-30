import React from 'react';

import style from './icons.module.scss';

const TickIcon = () => {
  return (
    <>
      <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.5 5.25L5 8.75L12 1.25"
          stroke="#11103D"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={style.fill2}
        />
      </svg>
    </>
  );
};

export default TickIcon;
