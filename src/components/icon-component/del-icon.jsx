import React from 'react';

import style from './icons.module.scss';

const DelIcon = ({ backClass }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        data-cy="projectcard-del-icon"
        width="47"
        height="52"
        viewBox="0 0 47 52"
        fill="none"
      >
        <path
          d="M42.1665 12.6667L39.8536 45.0467C39.6543 47.8376 37.3319 50 34.5339 50H12.4658C9.66773 50 7.34538 47.8376 7.14603 45.0467L4.83317 12.6667M18.1665 23.3333V39.3333M28.8332 23.3333V39.3333M31.4998 12.6667V4.66667C31.4998 3.19391 30.3059 2 28.8332 2H18.1665C16.6937 2 15.4998 3.19391 15.4998 4.66667V12.6667M2.1665 12.6667H44.8332"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={`${style.strokeBlue} ${backClass}`}
        />
      </svg>
    </>
  );
};

export default DelIcon;
