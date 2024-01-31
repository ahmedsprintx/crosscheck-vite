import React from 'react';

import style from './icons.module.scss';

const TestRunIcon = ({ backClass }) => {
  return (
    <>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.00146 12.1424L12.1443 6.99957M12.1443 6.99957H8.28718M12.1443 6.99957V10.8567"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${style.fill2} ${backClass}`}
        />
        <circle
          cx="9.57143"
          cy="9.57143"
          r="8.57143"
          stroke="white"
          strokeWidth="1"
          className={`${style.fill2} ${backClass}`}
        />
      </svg>
    </>
  );
};

export default TestRunIcon;
