import React from 'react';

import style from './icons.module.scss';

const LogoIcon = () => {
  return (
    <>
      <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 7L5 1H17L21 7M1 7L11 17M1 7H21M11 17L21 7M11 17L15 7L11 1L7 7L11 17Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.fill}
        />
      </svg>
    </>
  );
};

export default LogoIcon;
