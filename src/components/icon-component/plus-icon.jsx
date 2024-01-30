import React from 'react';

import style from './icons.module.scss';

const PlusIcon = () => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.99995 0C8.44178 0 8.79995 0.358172 8.79995 0.8V15.2C8.79995 15.6418 8.44178 16 7.99995 16C7.55812 16 7.19995 15.6418 7.19995 15.2V0.8C7.19995 0.358172 7.55812 0 7.99995 0Z"
          fill="#11103D"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 7.99922C0 7.55739 0.358172 7.19922 0.8 7.19922H15.2C15.6418 7.19922 16 7.55739 16 7.99922C16 8.44105 15.6418 8.79922 15.2 8.79922H0.8C0.358172 8.79922 0 8.44105 0 7.99922Z"
          className={style.fill4}
        />
      </svg>
    </>
  );
};

export default PlusIcon;
