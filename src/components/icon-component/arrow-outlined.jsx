import React from 'react';
import style from './icons.module.scss';

const ArrowOutlined = () => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <g clipPath="url(#clip0_10800_63706)">
          <path
            d="M3.30523 12.5003L2.51682 5.40321C2.291 3.37212 4.38212 1.88014 6.22916 2.75601L21.8199 10.1415C23.8106 11.084 23.8106 13.9165 21.8199 14.859L6.22916 22.2445C4.38212 23.1191 2.291 21.6284 2.51682 19.5973L3.30523 12.5003ZM3.30523 12.5003H12.4425"
            stroke="#071952"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={style.fill2}
          />
        </g>
        <defs>
          <clipPath id="clip0_10800_63706">
            <rect width="24" height="24" fill="white" transform="translate(0.5 0.5)" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default ArrowOutlined;
