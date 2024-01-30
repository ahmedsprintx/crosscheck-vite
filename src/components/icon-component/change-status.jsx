import React from 'react';

import style from './icons.module.scss';

const ChangeStatus = ({ backClass }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <g clip-path="url(#clip0_12423_18141)">
          <path
            d="M13.9998 4.66667L11.3332 2L8.6665 4.66667"
            stroke="#8B909A"
            className={`${style.fill2} ${backClass}`}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M11.3333 2V9.33333C11.3333 9.86377 11.1226 10.3725 10.7475 10.7475C10.3725 11.1226 9.86377 11.3333 9.33333 11.3333H2"
            stroke="#8B909A"
            className={`${style.fill2} ${backClass}`}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4.66667 8.66663L2 11.3333L4.66667 14"
            stroke="#8B909A"
            className={`${style.fill2} ${backClass}`}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_12423_18141">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default ChangeStatus;
