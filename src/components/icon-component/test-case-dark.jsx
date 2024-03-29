import React from 'react';

import style from './icons.module.scss';

const TestCaseIcon = () => {
  return (
    <>
      <svg width="17" height="17" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.0635 1.10693H2.76587C1.79061 1.10693 1 1.89754 1 2.87281V15.2339C1 16.2092 1.79061 16.9998 2.76587 16.9998H15.127C16.1023 16.9998 16.8929 16.2092 16.8929 15.2339V9.9363"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.fill2}
        />
        <path
          d="M6.73847 8.61208L13.802 1.54859C14.5334 0.817137 15.7194 0.817137 16.4508 1.54859C17.1822 2.28004 17.1822 3.46595 16.4508 4.1974L9.38728 11.2609L5.41406 12.5853L6.73847 8.61208Z"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.fill2}
        />
      </svg>
    </>
  );
};

export default TestCaseIcon;
