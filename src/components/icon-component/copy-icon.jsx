import React from 'react';

import style from './icons.module.scss';

const CopyIcon = () => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.78125 4.5C5.07364 4.5 4.5 5.07364 4.5 5.78125V12.7188C4.5 13.4264 5.07364 14 5.78125 14H12.7188C13.4264 14 14 13.4264 14 12.7188V5.78125C14 5.07364 13.4264 4.5 12.7188 4.5H5.78125ZM3.5 5.78125C3.5 4.52135 4.52135 3.5 5.78125 3.5H12.7188C13.9786 3.5 15 4.52135 15 5.78125V12.7188C15 13.9786 13.9786 15 12.7188 15H5.78125C4.52135 15 3.5 13.9786 3.5 12.7188V5.78125Z"
          fill="#8B909A"
          className={style.grey}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.49852 1L3.5 1H10.25L10.2514 1C10.8473 1.0017 11.4182 1.23914 11.8395 1.66047C12.2609 2.08179 12.4983 2.65274 12.5 3.24858C12.5 3.25252 12.5 3.25647 12.4999 3.26041L12.4843 4.01041C12.4785 4.2865 12.25 4.50564 11.974 4.49989C11.6979 4.49414 11.4787 4.26567 11.4845 3.98959L11.5 3.24601C11.4976 2.91636 11.3656 2.60078 11.1324 2.36757C10.8981 2.13324 10.5806 2.00111 10.2492 2H3.50079C3.10319 2.00136 2.72224 2.1599 2.44107 2.44107C2.1599 2.72224 2.00136 3.10319 2 3.50079V10.2492C2.00111 10.5806 2.13324 10.8981 2.36757 11.1324C2.60191 11.3668 2.91942 11.4989 3.25081 11.5H4C4.27614 11.5 4.5 11.7239 4.5 12C4.5 12.2761 4.27614 12.5 4 12.5H3.25L3.24858 12.5C2.65274 12.4983 2.08179 12.2609 1.66047 11.8395C1.23914 11.4182 1.0017 10.8473 1 10.2514L1 10.25V3.5L1 3.49852C1.00196 2.83648 1.26582 2.2021 1.73396 1.73396C2.2021 1.26582 2.83648 1.00196 3.49852 1Z"
          fill="#8B909A"
          className={style.grey}
        />
      </svg>
    </>
  );
};

export default CopyIcon;
