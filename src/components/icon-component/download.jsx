import React from 'react';
import style from './icons.module.scss';

const DownloadIcon = () => {
  return (
    <>
      <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.2998 0.5V11M8.2998 11L11.7998 7.5M8.2998 11L4.2998 7.5M1.2998 9.5C1.2998 11.4041 1.2998 12.4585 1.2998 13.0002C1.2998 13.2763 1.52366 13.5 1.7998 13.5H14.7998C15.0759 13.5 15.2998 13.2761 15.2998 13V9.5"
          stroke="#11103D"
          strokeLinecap="round"
          className={style.fill2}
        />
      </svg>
    </>
  );
};

export default DownloadIcon;
