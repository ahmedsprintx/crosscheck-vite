import React from 'react';

import style from './icons.module.scss';

const AccountSettingIcon = () => {
  return (
    <>
      <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.55561 8.55556C10.642 8.55556 12.3334 6.86419 12.3334 4.77778C12.3334 2.69137 10.642 1 8.55561 1C6.4692 1 4.77783 2.69137 4.77783 4.77778C4.77783 6.86419 6.4692 8.55556 8.55561 8.55556Z"
          stroke="#11103D"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={style.fill2}
        />
        <path
          d="M1 18.0002V14.2224C1 13.1792 1.84568 12.3335 2.88889 12.3335H14.2222C15.2655 12.3335 16.1111 13.1792 16.1111 14.2224V18.0002"
          stroke="#11103D"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={style.fill2}
        />
      </svg>
    </>
  );
};

export default AccountSettingIcon;
