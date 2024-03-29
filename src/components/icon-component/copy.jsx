import React from 'react';

import style from './icons.module.scss';

const Copy1Icon = ({ backClass }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <g clipPath="url(#clip0_12423_18257)">
          <path
            d="M9.3335 2V4.66667C9.3335 4.84348 9.40373 5.01305 9.52876 5.13807C9.65378 5.2631 9.82335 5.33333 10.0002 5.33333H12.6668"
            className={`${style.fill2} ${backClass}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.3335 8.66667V3.33333C3.3335 2.97971 3.47397 2.64057 3.72402 2.39052C3.97407 2.14048 4.31321 2 4.66683 2H9.3335L12.6668 5.33333V12.6667C12.6668 13.0203 12.5264 13.3594 12.2763 13.6095C12.0263 13.8595 11.6871 14 11.3335 14H7.66683"
            className={`${style.fill2} ${backClass}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.94348 10.3987C6.54283 9.72434 5.53494 9.41893 4.79713 9.87359C4.70973 9.92744 4.42165 10.105 4.34955 10.1494C3.60796 10.6064 3.36657 11.5824 3.81038 12.3294C4.19282 12.9731 4.95926 13.2367 5.63843 13.0049C5.74744 12.9677 5.85417 12.9177 5.95673 12.8545M5.89911 11.0423C6.29977 11.7166 7.30766 12.0221 8.04547 11.5674C8.13286 11.5135 8.42095 11.336 8.49304 11.2916C9.23464 10.8346 9.47603 9.85856 9.03221 9.11156C8.64978 8.46786 7.88335 8.20426 7.20417 8.43608C7.09516 8.47329 6.98841 8.52325 6.88585 8.58645"
            className={`${style.fill2} ${backClass}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_12423_18257">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default Copy1Icon;
