import React from 'react';

import style from './icons.module.scss';

const ExitIcon = () => {
  return (
    <>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 12L9 12"
          stroke="#8B909A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.greyStroke}
        />
        <path
          d="M16 17L21 12L16 7"
          stroke="#8B909A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.greyStroke}
        />
        <path
          d="M3 21L3 3"
          stroke="#8B909A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.greyStroke}
        />
      </svg>
    </>
  );
};

export default ExitIcon;
