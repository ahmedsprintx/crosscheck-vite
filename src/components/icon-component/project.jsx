import React from 'react';

import style from './icons.module.scss';

const ProjectIcon = () => {
  return (
    <>
      <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.5 6.95C1.5 6.01112 2.26112 5.25 3.2 5.25H16.8C17.7389 5.25 18.5 6.01112 18.5 6.95V16.3C18.5 17.2389 17.7389 18 16.8 18H3.2C2.26112 18 1.5 17.2389 1.5 16.3V6.95Z"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.fill}
        />
        <path
          d="M13.3999 5.25V2.7C13.3999 1.76112 12.6388 1 11.6999 1H8.29985C7.36097 1 6.59985 1.76112 6.59985 2.7V5.25"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.fill}
        />
        <path
          d="M18.5 9.5L10.3334 11.1334C10.1133 11.1773 9.88669 11.1773 9.66663 11.1334L1.5 9.5"
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

export default ProjectIcon;
