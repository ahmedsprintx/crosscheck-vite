import React from 'react';

import style from './icons.module.scss';

const Arrow = ({ backClass, click }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" onClick={click}>
        <path
          d="M6 12L10 8L6 4"
          stroke="#8B909A"
          className={`${style.fill2} ${backClass}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

export default Arrow;
