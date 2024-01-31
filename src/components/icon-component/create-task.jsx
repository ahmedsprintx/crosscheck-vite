import React from 'react';

import style from './icons.module.scss';

const CreateTask = ({ backClass }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
        <path
          d="M1 1.59L1.56 2.14999L2.95999 0.75"
          stroke="#8B909A"
          className={`${style.fill2} ${backClass}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 5.78995L1.56 6.34995L2.95999 4.94995"
          stroke="#8B909A"
          className={`${style.fill2} ${backClass}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 9.99002L1.56 10.55L2.95999 9.15002"
          stroke="#8B909A"
          className={`${style.fill2} ${backClass}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.2002 9.84995H13.6002M13.6002 9.84995H15.0002M13.6002 9.84995V8.44995M13.6002 9.84995V11.25"
          stroke="#8B909A"
          className={`${style.fill2} ${backClass}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 5.65002H14.3"
          stroke="#8B909A"
          className={`${style.fill2} ${backClass}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 9.84998H10.8"
          stroke="#8B909A"
          className={`${style.fill2} ${backClass}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 1.44995H14.3"
          stroke="#8B909A"
          className={`${style.fill2} ${backClass}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

export default CreateTask;
