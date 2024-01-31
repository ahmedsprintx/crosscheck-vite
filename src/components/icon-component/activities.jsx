import React from 'react';

import style from './icons.module.scss';

const ActivityIcon = () => {
  return (
    <>
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5.92105 8.15789H1L4.57895 4.57895H10.8421L12.6316 2.78949C13.6383 1.78272 14.7867 1.00002 16.2105 1.00002L18 1V2.78949C18 4.13159 17.1053 5.47369 16.2105 6.36843L14.4211 8.15789V14.4211L10.8421 18V13.0789"
          stroke="#11103D"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.fill2}
        />
        <path
          d="M9.90231 9.05273L5.47363 13.4814"
          stroke="#11103D"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.fill2}
        />
      </svg>
    </>
  );
};

export default ActivityIcon;
