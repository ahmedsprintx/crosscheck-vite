import React from 'react';

import style from './icons.module.scss';

const ReopenIcon = ({ backClass }) => {
  return (
    <>
      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.25 10.2501L10.75 5.75009M10.75 5.75009H7.375M10.75 5.75009V9.12509"
          stroke="#11103D"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${style.fill2} ${backClass}`}
        />
        <path
          d="M4.75 1.50351C5.88964 0.844185 7.18338 0.49798 8.5 0.500009C12.6422 0.500009 16 3.85776 16 8C16 12.1423 12.6422 15.5 8.5 15.5C4.35775 15.5 1 12.1423 1 8C1 6.63426 1.36525 5.35251 2.0035 4.25001"
          stroke="#11103D"
          strokeLinecap="round"
          className={`${style.fill2} ${backClass}`}
        />
      </svg>
    </>
  );
};

export default ReopenIcon;
