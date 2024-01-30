import React from 'react';

import style from './icons.module.scss';

const RafelIcon = () => {
  return (
    <>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_10899_56145)">
          <path
            d="M20 12H10"
            stroke="#8B909A"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className={style.grey}
          />
          <path
            d="M20 12L16 16"
            stroke="#8B909A"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className={style.grey}
          />
          <path
            d="M20 12L16 8"
            stroke="#8B909A"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className={style.grey}
          />
          <path
            d="M4 4V20"
            stroke="#8B909A"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className={style.grey}
          />
        </g>
        <defs>
          <clipPath id="clip0_10899_56145">
            <rect width="24" height="24" rx="5" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default RafelIcon;
