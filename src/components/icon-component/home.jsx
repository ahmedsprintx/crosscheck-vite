import React from 'react';

import style from './icons.module.scss';

const HomeIcon = () => {
  return (
    <>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 7.44444V16.1111C1 16.602 1.39796 17 1.88889 17H5.8254C6.31632 17 6.71428 16.602 6.71428 16.1111V10.1428H11.2857V16.1111C11.2857 16.602 11.6836 17 12.1746 17H16.1111C16.602 17 17 16.602 17 16.1111V7.44444C17 7.16466 16.8683 6.9012 16.6444 6.73333L9 1L1.35556 6.73333C1.13172 6.9012 1 7.16466 1 7.44444Z"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.fill}
        />
      </svg>
    </>
  );
};

export default HomeIcon;
